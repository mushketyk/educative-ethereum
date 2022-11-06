const fs = require('fs')
const Web3 = require('web3')

require('dotenv').config()

deployNameService()
  .then(() => console.log('Smart contract deployed'))
  .catch((error) => console.log('Failed to deploy a smart contract: ' + error))

async function deployNameService() {
  // Read smart contract data
  const bytecode = fs.readFileSync('NameService_sol_NameService.bin', 'utf8')
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

  const nameServiceContract = new web3.eth.Contract(abi)

  // Create a transaction to deploy to Ethereum
  const transaction = nameServiceContract.deploy({
    data: '0x' + bytecode,
  }).encodeABI()

  // Estimate the amount of gas we need to deploy a smart contract
  const gasEstimate = await web3.eth.estimateGas({data: transaction})
  console.log('Gas estimate: ' + gasEstimate)

  // Sign a transaction to send
  const signedTransaction = await web3.eth.accounts.signTransaction(
    {
      data: transaction,
      gas: gasEstimate,
    },
    // A private key that should be used to sign a transaction
    process.env.PRIVATE_KEY
  );

  // Send a sign transaction
  // This will send a transaction to Infura
  const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    // Callback to get a transaction hash
    .on('transactionHash', function(transactionHash) {
      console.log(`Transaction hash: ${transactionHash}`)
    })
    // Callback to get a transaction confirmation
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log('Receipt: ' + JSON.stringify(confirmationNumber))
      console.log(`Confirmation number: ${confirmationNumber}`)
      console.log(`Block number: ${receipt.blockNumber}`)
      console.log(`Block hash: ${receipt.blockHash}`)
    })

  console.log('Contract address: ' + receipt.contractAddress)
}