require('dotenv').config()
const Web3 = require('web3')

const BridgeGoerli = require('../artifacts/contracts/BridgeGoerli.sol/BridgeGoerli.json')
const BridgePolyPoc = require('../artifacts/contracts/BridgepolyPoc.sol/BridgePolyPoc.json')

const web3Goerli = new Web3("https://rpc.goerli.mudit.blog/")
const web3PolyPoc = new Web3("http://172.18.0.2:10002")

const adminPrivKey = process.env.METAMASK_PRIVATE_KEY
const { address: admin } = web3PolyPoc.eth.accounts.wallet.add(adminPrivKey);

const bridgeGoerli = new web3Goerli.eth.Contract(
  BridgeGoerli.abi,
  "0x1Eb70035d0F0971fcDa497F00bd9FA5333897C74"
);

const bridgePolyPoc = new web3PolyPoc.eth.Contract(
  BridgePolyPoc.abi,
  "0x45bc540C24A2515a3Aa48F49D2Dc7B3899A34d2f"
);

bridgeGoerli.events.Transfer(
  { fromBlock: 0, step: 0 }
).on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridgePolyPoc.methods.mint(to, amount, nonce);

  const [gasPrice, gasCost] = await Promise.all([
    web3PolyPoc.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  const data = tx.encodeABI();

  const txData = {
    from: admin,
    to: bridgePolyPoc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };

  const receipt = await web3PolyPoc.eth.sendTransaction(txData);

  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});