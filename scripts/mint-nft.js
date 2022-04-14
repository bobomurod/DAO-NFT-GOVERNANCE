require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const MYPKRKY = process.env.MYPKRKY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const contractAddress = "0x01c971eC37f21ea45A163879Dca9692a5C1C678f";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //this is transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(tx, MYPKRKY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemys Mempool to view the status of your transaction.\n"
            );
          } else {
            console.log("Somethis went wrong", err);
          }
        }
      );
    })
    .catch((err) => {
      console.log("Promise failed: ", err);
    });
}

mintNFT("ipfs://QmRUGFekKYorPxx2M1CYGSzeX55Cmr62R6Li6LNfZj3y9q");

