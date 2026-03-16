import { useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract';

/**
 * Custom hook for writing to smart contract (wagmi v2)
 */
export const useContractFunction = (functionName) => {
  return useWriteContract();
};

/**
 * Custom hook for reading from smart contract (wagmi v2)
 */
export const useContractData = (functionName, args = [], options = {}) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: functionName,
    args: args,
    query: {
      enabled: options.enabled !== false,
    },
  });
};

/**
 * Helper to prepare write contract args for wagmi v2
 */
export const prepareContractWrite = (functionName, args) => {
  return {
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: functionName,
    args: args,
  };
};

/**
 * Validates Ethereum address format
 */
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Formats address to shortened version
 */
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Converts BigInt to readable number
 */
export const formatBalance = (balance) => {
  if (!balance) return '0';
  return balance.toString();
};

/**
 * Validates positive number input
 */
export const isValidPositiveNumber = (number) => {
  const num = Number(number);
  return !isNaN(num) && num > 0;
};

/**
 * Validates comma-separated list
 */
export const parseCommaSeparated = (input) => {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

/**
 * Validates arrays match in length
 */
export const arraysMatch = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.length > 0;
};
