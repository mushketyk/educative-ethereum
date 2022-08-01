import React, { useState } from 'react'
import OutlinedInput from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {
  useNavigate,
} from 'react-router-dom'
import { Box } from '@mui/material';


export default function Auction() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')

  return (
    <>
      <Box sx={{ my: 2 }}>
        <OutlinedInput
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          label='Address'
          fullWidth
        />
      </Box>
      <Button
        variant='contained'
        onClick={() => {
          navigate(`/auctions/${address}`)
        }}
      >
        Go To Contract
      </Button>
    </>
  )
}
