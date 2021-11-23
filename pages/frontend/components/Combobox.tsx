import React from 'react';
import Autocomplete from '@material-ui/core/Autocomplete';
import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment } from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: '#000',
  },
  input: {
    color: '#000',
  },
  root: {
    color: '#000',
  },
  inputFocused: {
    color: '#000',
  },
  popupIndicator: {
    color: '#000',
  },
  tag: {
    color: '#000',
  },
  tagSizeSmall: {
    color: '#000',
  },
  tagSizeMedium: {
    color: '#000',
  },
  focused:{
    color: '#000',
  },
  floatingLabelFocusStyle: {
    color: "#000"
  }
}));


const Combobox = (props) => {
  
  const classes = useStyles();

  const styles = {
    floatingLabelFocusStyle: {
        color: "#000"
    }
  }
  
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{height:"100%", width:"100%"}}>
      <h3>{props.title}</h3>
      <Autocomplete
        classes={classes}
        options={props.options}
        style={{ width: 300 }}
        renderInput={(params) =>
          <TextField {...params} label={props.unselect} variant="outlined" InputLabelProps={{
            className: classes.floatingLabelFocusStyle,
        }} />}
      value={props.selectedItem}
        onChange={(_event, newItem) => {
          props.setSelectedItem(newItem);
        }}
      />
    </Grid>
  );
}

  
export default Combobox;