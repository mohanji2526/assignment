import React, { useState } from 'react';
import axios from 'axios';
import { ListItem, ListItemText, TextField, Button, Box } from '@mui/material';

const ContractItem = ({ contract, fetchContracts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contract);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contracts/${contract.id}`, formData);
      setIsEditing(false);
      fetchContracts();
      alert('Contract updated successfully!');
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/contracts/${contract.id}`);
      fetchContracts();
      alert('Contract deleted successfully!');
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  return (
    <ListItem>
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Client Name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contract ID"
            name="contract_id"
            value={formData.contract_id}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            margin="normal"
            select
            SelectProps={{ native: true }}
          >
            <option value="Draft">Draft</option>
            <option value="Finalized">Finalized</option>
          </TextField>
          <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mr: 2 }}>
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="outlined">
            Cancel
          </Button>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <ListItemText
            primary={`Client: ${contract.client_name}`}
            secondary={`Contract ID: ${contract.contract_id} | Status: ${contract.status}`}
          />
          <Button onClick={() => setIsEditing(true)} variant="contained" color="primary" sx={{ mr: 2 }}>
            Edit
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </Box>
      )}
    </ListItem>
  );
};

export default ContractItem;