import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: { 
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}