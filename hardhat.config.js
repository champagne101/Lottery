require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();
//require("@nomiclabs/hardhat-etherscan");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  gasReporter: {
    enabled: true,
    currency: 'CHF',
    gasPrice: 21
  },
  networks: {
    dev: {
        url: "http://localhost:7545",
        gasPrice: 20,
        saveDeployments: true
    },
    bsctest: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        accounts: [process.env.PRIV_KEY],
        gasPrice: 10000000000,
        blockGasLimit: 1000000
    },
    bsc: {
        url: "https://bsc-dataseed1.binance.org/",
        accounts: [process.env.PRIV_KEY],
        gasPrice: 5100000000,
        blockGasLimit: 1000000
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.7.3"
      }
    ]
  } 
};

