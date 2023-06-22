require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { POLYGON_PVTKEY } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545", //Your RPC URL
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ], //Your private key
    },
    polygon: {
      chainId: 80001,
      url: "https://polygon-mumbai.g.alchemy.com/v2/zy0YskI1Q19N6MsIo4KWq2goniaYKTix", // Your RPC url
      accounts: [
        "0x9be733bc5526347f994a33c964ebcf278bdf0036c9daf4587808657ce23296b9",
      ], // yout private key
    },

    Bttc: {
      chainId: 1029,
      url: "https://pre-rpc.bt.io/", // Your RPC url
      accounts: [`0x${POLYGON_PVTKEY}`], // yout private key
    },
    // goerli: {
    //   chainId: 05,
    //   url: "", // your RPC URl
    //   accounts: [""], // Your Private key
    // },
  },
};
