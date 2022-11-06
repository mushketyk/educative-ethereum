const fs = require('fs')
const Web3 = require('web3')

require('dotenv').config()

registerName()
  .then(() => console.log('Registered a new name successfully'))
  .catch((error) => console.log('Failed to register a new name: ' + error))

async function registerName() {
  // Read contract ABI
  const abiStr = fs.readFileSync('NameService_sol_NameService.abi', 'utf8')

  // Parse contract ABI
  const abi = JSON.parse(abiStr)

  // Create Web3
  const web3 = new Web3()
  // Configure Web3 to use Infura
  web3.setProvider(
    new web3.providers.HttpProvider(
      process.env.WEB3_URL
    )
  )

  const nameServiceContract = new web3.eth.Contract(abi, process.env.NAME_SERVICE_ADDRESS)

  // Create a transaction to deploy to Ethereum
  const transaction = nameServiceContract.methods.registerNewName('name-service', process.env.NAME_SERVICE_ADDRESS)

  // Estimate the amount of gas we need to deploy a smart contract
  const gasEstimate = await transaction.estimateGas()
  console.log('Gas estimate: ' + gasEstimate)

  // Sign a transaction to send
  console.log('Sending transaction')
  const signedTransaction = await web3.eth.accounts.signTransaction(
    {
      to: process.env.NAME_SERVICE_ADDRESS,
      data: transaction.encodeABI(),
      gas: gasEstimate,
    },
    // A private key that should be used to sign a transaction
    process.env.PRIVATE_KEY
  );

//   // Send a sign transaction
//   // This will send a transaction to Infura
  await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

  const result = await nameServiceContract.methods.getAddress('name-service').call()

  console.log("Result: " + result)
}