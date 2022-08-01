import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/TextField';
import React, { useState } from 'react';
import Web3 from 'web3';
import { etherToWei, getAuctionContract } from '../web3/utils';

export default function BidInput(props) {
  const [bidAmount, setBidAmount] = useState('')

  const {
    contractState,
    contractAddress,
    currentAccount
  } = props

  function isValidNumber(num) {
    return !isNaN(num);
  }

  function canBeWinningBid() {
    return Number(bidAmount) + contractState.accountBid > contractState.highestBid
  }

  async function onContribute(event) {
    const web3 = new Web3(window.ethereum)
    const amount = etherToWei(bidAmount)

    const contract = getAuctionContract(web3, contractAddress)

    await contract.methods.placeBid().send({
        value: amount,
        from: currentAccount,
    })
      .once('transactionHash', function(hash) {
        console.log('Transaction hash received', hash)
      })
      .once('receipt', function(receipt) {
        console.log('Transaction receipt received', receipt)
      })
      .on('confirmation', function(confNumber, receipt) {
        console.log('Confirmation', confNumber)
      })
  }


  const validBid = isValidNumber(bidAmount) && canBeWinningBid()

  return (
    <>
      <Box sx={{ my: 2 }}>
        <OutlinedInput
          value={bidAmount}
          onChange={(event) => setBidAmount(event.target.value)}
          label='Amount'
          fullWidth
          error={bidAmount !== '' && !validBid}
        />
      </Box>

      <Button
        variant='contained'
        onClick={() => {
          onContribute()
        }}
        disabled={bidAmount === '' || !validBid}
      >
        Contribute
      </Button>
    </>
  )
}
