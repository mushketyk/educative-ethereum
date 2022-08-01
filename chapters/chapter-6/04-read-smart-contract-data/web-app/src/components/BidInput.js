import React, { useState } from 'react'
import OutlinedInput from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BidInput(props) {
  const [bidAmount, setBidAmount] = useState('')

  const {contractState} = props

  function isValidNumber(num) {
    return !isNaN(num);
  }

  function canBeWinningBid() {
    return Number(bidAmount) + contractState.accountBid > contractState.highestBid
  }

  const validBid = isValidNumber(bidAmount) && canBeWinningBid()

  return (
    <>
      <Box sx={{ my: 2 }}>
        <OutlinedInput
          id='outlined-adornment-amount'
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
            alert('TODO: Implement bidding')
        }}
        disabled={bidAmount === '' || !validBid}
      >
        Contribute
      </Button>
    </>
  )
}
