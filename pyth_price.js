import { ethers } from 'ethers';
import PythAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

async function getEthPrice() {
    const contractAddress = '0x4305FB66699C3B2702D4d05CF36551390A4c69C6';
    const provider = new ethers.providers.JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    const contract = new ethers.Contract(contractAddress, PythAbi, provider);
    const ethPriceId = "0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688";

    try {
        const priceData = await contract.getPriceUnsafe(ethPriceId);
        
        // Convert BigNumber to regular number and handle exponent
        const price = Number(priceData.price) / (10 ** Math.abs(Number(priceData.expo)));
        const confidence = Number(priceData.conf) / (10 ** Math.abs(Number(priceData.expo)));
        const timestamp = new Date(Number(priceData.publishTime) * 1000);
        
        console.log(`AAPL Price: $${price.toFixed(2)}`);
        console.log(`Confidence: ±$${confidence.toFixed(2)}`);
        console.log(`Timestamp: ${timestamp.toISOString()}`);
        
        return { price, confidence, timestamp };
    } catch (error) {
        console.error('Error fetching AAPL price:', error);
        throw error;
    }
}

getEthPrice();