import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import UploadContract from '../../new_frontend/src/components/UploadContract';
import ContractList from '../../new_frontend/src/components/ContractList';
import { ThemeContext } from '@mui/system';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Upload Contract" />
          <Tab label="View Contracts" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <UploadContract />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ContractList />
      </TabPanel>
    </div>
  );
}

export default App;
 