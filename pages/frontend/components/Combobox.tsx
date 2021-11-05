import React from 'react';
import Autocomplete from '@material-ui/core/Autocomplete';
import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment } from '@material-ui/core';
  

const Combobox = (props) => {
  

  
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{height:"100%", width:"100%"}}>
      <h3>{props.title}</h3>
      <Autocomplete
        options={props.options}
        style={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label={props.unselect} variant="outlined" />}
      />
    </Grid>
  );
}
  
export default Combobox;