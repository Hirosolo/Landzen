// Import the actual contract ABIs from the contracts directory
import LandTokenizerContract from '../../contracts/LandTokenizer.json';
import LandContract from '../../contracts/Land.json';
import MockUSDTContract from '../../contracts/MockUSDT.json';

// Export the ABIs for use in the application
export const LandTokenizerABI = LandTokenizerContract.abi;
export const LandABI = LandContract.abi;
export const MockUSDTABI = MockUSDTContract.abi;

// Export types for better TypeScript support
export type LandTokenizerABI = typeof LandTokenizerABI;
export type LandABI = typeof LandABI;
export type MockUSDTABI = typeof MockUSDTABI;
