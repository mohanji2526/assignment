import React, { useState } from 'react';
import axios from 'axios';

const ContractForm = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    contract_id: '',
    details: {},
    status: 'Draft'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contracts', formData);
      alert('Contract uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading contract:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="client_name"
        placeholder="Client Name"
        value={formData.client_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contract_id"
        placeholder="Contract ID"
        value={formData.contract_id}
        onChange={handleChange}
        required
      />
      <textarea
        name="details"
        placeholder="Details (JSON)"
        value={JSON.stringify(formData.details)}
        onChange={(e) => setFormData({ ...formData, details: JSON.parse(e.target.value) })}
        required
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Draft">Draft</option>
        <option value="Finalized">Finalized</option>
      </select>
      <button type="submit">Upload Contract</button>
    </form>
  );
};

export default ContractForm;