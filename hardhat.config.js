require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        url: process.env.SEPOLIA_URL, // or Infura
        accounts:[process.env.PK]
      },
    },
    sepolia:{
    // gasPrice : secret.gasPrice * 1000000000,
    url: process.env.SEPOLIA_URL,
    accounts: [process.env.PK]
  },
  },
};
