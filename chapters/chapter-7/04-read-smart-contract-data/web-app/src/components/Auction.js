import { Alert, Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import {
  useParams
} from 'react-router-dom';
import Web3 from 'web3';
import { getAuctionContract, weiToEther } from '../web3/utils';
import BidInput from './BidInput';

export default function Auction() {

  const [contractState, setContractInfo] = useState({
    highestBid: 1.2,
    totalBids: 85,
    deadline: Date.now() / 1000,
    accountBid: 1,
  })
  const [currentAccount, setCurrentAccount] = useState(null)
  const { address } = useParams();

  const web3 = useMemo(() => new Web3(window.ethereum), [])

  async function getCurrentAccount() {
    const accounts = await web3.eth.getAccounts()
    setCurrentAccount(accounts[0])
  }

  async function connectWallet() {
    const accounts = await web3.eth.requestAccounts()
    setCurrentAccount(accounts[0])
  }

  useEffect(() =>  {
    // We can't use "async/await" in "useEffect" so we should move
    // it to a separate function
    getCurrentAccount()
  })

  useEffect(() => {
    async function getCampaign(address) {
      if (!currentAccount) return;

      const contract = getAuctionContract(web3, address)

      const highestBid = weiToEther(await contract.methods.highestBid().call())
      const totalBids = await contract.methods.totalBidsNum().call()
      const deadline = await contract.methods.deadline().call()
      const accountBid = weiToEther(await contract.methods.totalBids(currentAccount).call())

      setContractInfo({
        highestBid: highestBid,
        totalBids: totalBids,
        deadline: deadline,
        accountBid: accountBid
      })
    }
    getCampaign(address)
  }, [web3, address, currentAccount])

  if (!currentAccount) {
    return (
      <>
        <Box sx={{ my: 2 }}>
          <Alert severity='info'>You need to first connect your Ethereum wallet to use the auction.</Alert>
        </Box>
        <Button variant='contained' onClick={() => connectWallet()}>Connect Wallet</Button>
      </>
    )
  }

  return (
    <>
      {renderContractState(contractState)}
      {renderInputs(contractState)}
    </>
  )
}

function renderContractState(contractState) {
  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <Card>
          <CardContent>
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Highest bid
            </Typography>
            <Typography variant='h4'>{contractState.highestBid} ETH</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card>
          <CardContent>
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Total bids
            </Typography>
            <Typography variant='h4'>{contractState.totalBids}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card>
          <CardContent>
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Ends at
            </Typography>
            <Typography variant='h4'>{formatDate(contractState.deadline)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={6}>
        <Card>
          <CardContent>
            <Typography
              color='textSecondary'
              variant='overline'
            >
              You've contributed
            </Typography>
            <Typography variant='h4'>{contractState.accountBid} ETH</Typography>
          </CardContent>
        </Card>
      </Grid>
   </Grid>
  )
}

function formatDate(seconds) {
  return new Date(seconds * 1000).toISOString().substring(0,16)
}

function renderInputs(contractState) {
  return <BidInput
    contractState={contractState}
  />
}
