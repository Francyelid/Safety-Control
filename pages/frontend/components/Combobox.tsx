import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
  

const Combobox = (props) => {
  

  
  return (
    <div style={{marginLeft:'40%', marginTop: '60px'}}>
      <h3>{props.title}</h3>
      <Autocomplete
        options={props.options}
        style={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label="Combo box" variant="outlined" />}
      />
    </div>
  );
}
  
export default Combobox;