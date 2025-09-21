// Import the actual contract ABIs from the contracts directory
import LandTokenizerContract from '../../contracts/LandTokenizer.json';
import LandContract from '../../contracts/Land.json';

// Export the ABIs for use in the application
export const LandTokenizerABI = LandTokenizerContract.abi;
export const LandABI = LandContract.abi;

// Export types for better TypeScript support
export type LandTokenizerABI = typeof LandTokenizerABI;
export type LandABI = typeof LandABI;
