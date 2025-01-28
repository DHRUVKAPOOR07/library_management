// src/Home.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Paper, TextField } from '@mui/material';

const Home = () => {
  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Books</Button>
          <Button color="inherit">Members</Button>
          <Button color="inherit">Borrow/Return</Button>
          <Button color="inherit">Reports</Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard */}
      <Grid container spacing={3} style={{ marginTop: '20px', padding: '20px' }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Total Books</Typography>
            <Typography variant="h3">1234</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Borrowed Books</Typography>
            <Typography variant="h3">456</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Overdue Returns</Typography>
            <Typography variant="h3">12</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Grid container justifyContent="center" style={{ marginTop: '30px' }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Search Books"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" style={{ height: '100%' }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
