require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        url: "https://sepolia.infura.io/v3/9026ed1af77347168fdc4cb5287fe67e", // or Infura
        accounts:[process.env.PK]
      },
    },
    sepolia:{
    // gasPrice : secret.gasPrice * 1000000000,
    url: "https://sepolia.infura.io/v3/9026ed1af77347168fdc4cb5287fe67e",
    accounts: [process.env.PK]
  },
  },
};
