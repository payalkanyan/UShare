require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

//for polygon
const API_URL = process.env.API_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
