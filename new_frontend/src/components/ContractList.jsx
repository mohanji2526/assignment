import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, MenuItem, List, ListItem, ListItemText, Button } from '@mui/material';
import ContractItem from './ContractItem';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchContracts();
  }, [statusFilter]);

  const fetchContracts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contracts?status=${statusFilter}`);
      setContracts(response.data.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Contract List</Typography>
      <TextField
        select
        label="Filter by Status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Draft">Draft</MenuItem>
        <MenuItem value="Finalized">Finalized</MenuItem>
      </TextField>
      <List>
        {contracts.map((contract) => (
          <ContractItem key={contract.id} contract={contract} fetchContracts={fetchContracts} />
        ))}
      </List>
    </Box>
  );
};

export default ContractList;