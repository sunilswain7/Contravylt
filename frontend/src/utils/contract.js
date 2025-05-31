import { ethers } from "ethers";
import ContractAbi from "./ContractAbi.json";
import NewsRegistryAbi from "./NewsRegistryAbi.json";


const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const newsRegistryAddress = process.env.NEXT_PUBLIC_NEWSREGISTRY_ADDRESS;


export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, ContractAbi, signer);
}

export function getNewsRegistryContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  // 🟢 Instead of signer, use provider directly for read-only calls
  return new ethers.Contract(newsRegistryAddress, NewsRegistryAbi, provider);
}

