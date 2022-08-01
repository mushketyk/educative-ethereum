

import React from 'react'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import ErrorIcon from '@mui/icons-material/Error'

function NotFound() {
  return <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
    <Grid item xs container direction='column'
      justifyContent='center'
      spacing={2}
      alignItems='center' >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <ErrorIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Not found
      </Typography>
    </Grid>
  </Paper>
}

export default NotFound
