import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const UploadContract = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    contract_id: '',
    details: '{}',
    status: 'Draft'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post('http://localhost:5000/api/contracts', {
        ...formData,
        details: JSON.parse(formData.details)
      });
      alert('Contract uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading contract:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Upload Contract</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Client Name"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Contract ID"
          name="contract_id"
          value={formData.contract_id}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Details (JSON)"
          name="details"
          value={formData.details}
          onChange={handleChange}
          margin="normal"
          required
          multiline
          rows={4}
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Upload Contract
        </Button>
      </form>
    </Box>
  );
};

export default UploadContract;