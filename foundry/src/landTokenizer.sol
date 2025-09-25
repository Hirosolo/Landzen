// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./land.sol";

contract LandTokenizer is Ownable, ReentrancyGuard, Pausable{

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// STATES ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    uint256 public landCount = 0;

    /**
     * @dev Property information for each tokenized land
     */
    struct PropertyInfo {
        address landContract;     // Address of the deployed Land contract
        address paymentToken;     // Stablecoin used for this property
        string propertyName;      // Name of the property
        string propertySymbol;    // Symbol for the property tokens
        uint256 totalValue;       // Total property value
        uint256 totalSupply;      // Maximum tokens available
        uint256 yieldRate;        // Yield per block per token
        uint256 startDate;        // When minting ends and yield begins
        uint256 projectLength;    // Investment period
        uint256 landType;         // Property type identifier
        address deployer;         // Who deployed this property
        uint256 deployedAt;       // Block number when deployed
        bool active;              // Whether property is active
    }
    
    mapping(uint256 => PropertyInfo) public properties;
    mapping(address => bool) public isLandZenProperty; // Track our deployed contracts
    mapping(address => bool) public blacklist; // Blacklisted addresses
    mapping(address => bool) public supportedStablecoins; // Approved stablecoins
    
    address[] public stablecoinList; // List of supported stablecoins for enumeration

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// MODIFIERS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    modifier onlyLandZenProperty(address propertyAddress) {
        require(isLandZenProperty[propertyAddress], "Not a LandZen property");
        _;
    }

    modifier validAddress(address addr) {
        require(addr != address(0), "Invalid address");
        _;
    }

    modifier notBlacklisted(address addr) {
        require(!blacklist[addr], "Address is blacklisted");
        _;
    }

    modifier validPropertyId(uint256 propertyId) {
        require(propertyId > 0 && propertyId <= landCount, "Invalid property ID");
        require(properties[propertyId].active, "Property not active");
        _;
    }

    modifier supportedStablecoin(address stablecoin) {
        require(supportedStablecoins[stablecoin], "Stablecoin not supported");
        _;
    }

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// EVENTS ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    event PropertyTokenized(
        uint256 indexed propertyId,
        address indexed landContract,
        address indexed paymentToken,
        string propertyName,
        uint256 totalValue,
        uint256 totalSupply
    );
    event BlacklistUpdated(address indexed addr, bool isBlacklisted);
    event PropertyStatusUpdated(uint256 indexed propertyId, bool active);
    event StablecoinUpdated(address indexed stablecoin, bool supported);
    event EmergencyPauseAll();
    event EmergencyUnpauseAll();

    constructor() Ownable(msg.sender) {
        // Add default stablecoin (existing one)
        address defaultStablecoin = 0xe92c929a47EED2589AE0eAb2313e17AFfEF22a55;
        supportedStablecoins[defaultStablecoin] = true;
        stablecoinList.push(defaultStablecoin);
    }

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// PROPERTY FACTORY FUNCTIONS ////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Deploy a new Land contract for property tokenization
     * @param _paymentToken Stablecoin address to use for this property
     * @param _propertyName Name of the property (e.g., "Sunset Villa Miami")
     * @param _propertySymbol Symbol for tokens (e.g., "SVMIA")
     * @param _totalValue Total property value in stablecoin units
     * @param _totalSupply Maximum number of tokens to be minted
     * @param _yieldRate Expected yield per block per token
     * @param _startDate Block number when minting ends and yield begins
     * @param _projectLength Investment period in blocks
     * @param _landType Property type identifier
     */
    function tokenizeProperty(
        address _paymentToken,
        string memory _propertyName,
        string memory _propertySymbol,
        uint256 _totalValue,
        uint256 _totalSupply,
        uint256 _yieldRate,
        uint256 _startDate,
        uint256 _projectLength,
        uint256 _landType
    ) external onlyOwner supportedStablecoin(_paymentToken) whenNotPaused returns (address) {
        require(_totalValue > 0, "Property value must be greater than 0");
        require(_totalSupply > 0, "Total supply must be greater than 0");
        require(_startDate > block.number, "Start date must be in the future");
        require(_projectLength > 0, "Project length must be greater than 0");
        require(bytes(_propertyName).length > 0, "Property name cannot be empty");
        require(bytes(_propertySymbol).length > 0, "Property symbol cannot be empty");

        // Deploy new Land contract
        Land newProperty = new Land(
            _paymentToken,
            _totalValue,
            _totalSupply,
            _yieldRate,
            _startDate,
            _projectLength,
            _landType,
            _propertyName,
            _propertySymbol
        );

        // Increment property counter
        landCount++;
        
        // Store property information
        properties[landCount] = PropertyInfo({
            landContract: address(newProperty),
            paymentToken: _paymentToken,
            propertyName: _propertyName,
            propertySymbol: _propertySymbol,
            totalValue: _totalValue,
            totalSupply: _totalSupply,
            yieldRate: _yieldRate,
            startDate: _startDate,
            projectLength: _projectLength,
            landType: _landType,
            deployer: msg.sender,
            deployedAt: block.number,
            active: true
        });

        // Mark as LandZen property
        isLandZenProperty[address(newProperty)] = true;

        emit PropertyTokenized(
            landCount,
            address(newProperty),
            _paymentToken,
            _propertyName,
            _totalValue,
            _totalSupply
        );

        return address(newProperty);
    }

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// ADMIN FUNCTIONS /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Add a supported stablecoin
     */
    function addSupportedStablecoin(address stablecoin) external onlyOwner validAddress(stablecoin) {
        require(!supportedStablecoins[stablecoin], "Stablecoin already supported");
        
        supportedStablecoins[stablecoin] = true;
        stablecoinList.push(stablecoin);
        emit StablecoinUpdated(stablecoin, true);
    }

    /**
     * @dev Remove a supported stablecoin
     */
    function removeSupportedStablecoin(address stablecoin) external onlyOwner validAddress(stablecoin) {
        require(supportedStablecoins[stablecoin], "Stablecoin not supported");
        
        supportedStablecoins[stablecoin] = false;
        
        // Remove from list
        for(uint256 i = 0; i < stablecoinList.length; i++) {
            if(stablecoinList[i] == stablecoin) {
                stablecoinList[i] = stablecoinList[stablecoinList.length - 1];
                stablecoinList.pop();
                break;
            }
        }
        
        emit StablecoinUpdated(stablecoin, false);
    }

    /**
     * @dev Blacklist an address from participating
     */
    function blacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = true;
        emit BlacklistUpdated(addr, true);
    }

    /**
     * @dev Remove address from blacklist
     */
    function unblacklistAddress(address addr) external onlyOwner validAddress(addr) {
        blacklist[addr] = false;
        emit BlacklistUpdated(addr, false);
    }

    /**
     * @dev Deactivate a property (emergency only)
     */
    function deactivateProperty(uint256 propertyId) external onlyOwner validPropertyId(propertyId) {
        properties[propertyId].active = false;
        emit PropertyStatusUpdated(propertyId, false);
    }

    /**
     * @dev Reactivate a property
     */
    function reactivateProperty(uint256 propertyId) external onlyOwner {
        require(propertyId > 0 && propertyId <= landCount, "Invalid property ID");
        properties[propertyId].active = true;
        emit PropertyStatusUpdated(propertyId, true);
    }
    
    /**
     * @dev Emergency pause all operations
     */
    function emergencyPauseAll() external onlyOwner {
        _pause();
        emit EmergencyPauseAll();
    }

    /**
     * @dev Unpause all operations
     */
    function unpauseAll() external onlyOwner {
        _unpause();
        emit EmergencyUnpauseAll();
    }

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////// GETTER FUNCTIONS /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Get property information by ID
     */
    function getPropertyInfo(uint256 propertyId) external view validPropertyId(propertyId) returns (PropertyInfo memory) {
        return properties[propertyId];
    }

    /**
     * @dev Get basic property details
     */
    function getPropertyBasics(uint256 propertyId) external view validPropertyId(propertyId) returns (
        address landContract,
        address paymentToken,
        string memory propertyName,
        uint256 totalValue,
        uint256 totalSupply,
        bool active
    ) {
        PropertyInfo memory prop = properties[propertyId];
        return (prop.landContract, prop.paymentToken, prop.propertyName, prop.totalValue, prop.totalSupply, prop.active);
    }

    /**
     * @dev Get all active properties (for frontend)
     */
    function getActiveProperties() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active properties
        for(uint256 i = 1; i <= landCount; i++) {
            if(properties[i].active) {
                activeCount++;
            }
        }
        
        // Build array of active property IDs
        uint256[] memory activeProperties = new uint256[](activeCount);
        uint256 index = 0;
        
        for(uint256 i = 1; i <= landCount; i++) {
            if(properties[i].active) {
                activeProperties[index] = i;
                index++;
            }
        }
        
        return activeProperties;
    }

    /**
     * @dev Get all properties (since only owner can deploy)
     */
    function getAllProperties() external view returns (uint256[] memory) {
        uint256[] memory allProperties = new uint256[](landCount);
        
        for(uint256 i = 1; i <= landCount; i++) {
            allProperties[i-1] = i;
        }
        
        return allProperties;
    }

    /**
     * @dev Check if address is blacklisted
     */
    function isBlacklisted(address addr) external view returns (bool) {
        return blacklist[addr];
    }

    /**
     * @dev Check if contract address is a LandZen property
     */
    function isLandZenContract(address contractAddr) external view returns (bool) {
        return isLandZenProperty[contractAddr];
    }

    /**
     * @dev Check if stablecoin is supported
     */
    function isStablecoinSupported(address stablecoin) external view returns (bool) {
        return supportedStablecoins[stablecoin];
    }

    /**
     * @dev Get all supported stablecoins
     */
    function getSupportedStablecoins() external view returns (address[] memory) {
        return stablecoinList;
    }

    /**
     * @dev Get properties by stablecoin
     */
    function getPropertiesByStablecoin(address stablecoin) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count properties using this stablecoin
        for(uint256 i = 1; i <= landCount; i++) {
            if(properties[i].paymentToken == stablecoin && properties[i].active) {
                count++;
            }
        }
        
        // Build array
        uint256[] memory stablecoinProperties = new uint256[](count);
        uint256 index = 0;
        
        for(uint256 i = 1; i <= landCount; i++) {
            if(properties[i].paymentToken == stablecoin && properties[i].active) {
                stablecoinProperties[index] = i;
                index++;
            }
        }
        
        return stablecoinProperties;
    }

    /**
     * @dev Get total number of properties ever created
     */
    function getTotalProperties() external view returns (uint256) {
        return landCount;
    }

    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalProperties,
        uint256 activeProperties
    ) {
        totalProperties = landCount;
        
        // Count active properties
        for(uint256 i = 1; i <= landCount; i++) {
            if(properties[i].active) {
                activeProperties++;
            }
        }
    }
}