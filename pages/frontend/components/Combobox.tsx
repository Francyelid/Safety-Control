import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
  

const Combobox = ({}) => {
  
  // Our sample dropdown options
  const options = ['Monday', 'Tuesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday']
  
  return (
    <div style={{marginLeft:'40%', marginTop: '60px'}}>
      <h3>Greetings from GeeksforGeeks!</h3>
      <Autocomplete
        options={options}
        style={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label="Combo box" variant="outlined" />}
      />
    </div>
  );
}
  
export default Combobox;