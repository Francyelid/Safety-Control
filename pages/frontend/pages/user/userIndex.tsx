import React, {useEffect, useState} from 'react';
import { useSession } from "next-auth/client";
import Router from 'next/router';
import DashboardLayout from '../../components/Layout';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import UserService from '../../../api/servicos/User/userService';
import User from '../../../api/models/UserModel';
import BaseRepository from '../../../api/repositorio/baseRepository';
import {Modal, Box, Typography, Button, TextField, InputAdornment, BoxProps, IconButton } from "@material-ui/core";
import { MailOutline, LockOutlined, Delete, AddBox  } from '@material-ui/icons';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const initial = {
    id:0,
    email: "",
    name:"",
    type:0,
    createdAt: Date(),
    updatedAt: Date(),
    password: ""
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        color: 'white',
        p: 1,
        m: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

const HomePage = () => {

  const columns = [
    { id: 'id', field: 'id', headerName: 'id', width: 70, editable:false, hide:true},
    { id: 'name', field: 'name', headerName: 'Nome', width: 130, editable:false },
    { id: 'email', field: 'email', headerName: 'Email', width: 130, editable:false },
    { id: 'type', field: 'type', headerName: 'Tipo de Usuário', width: 130 , editable:false},
    { id: 'createdAt', field: 'createdAt', headerName: 'Data de criação', width: 130, editable:false },
    { id: 'updatedAt', field: 'updatedAt', headerName: 'Data de update', width: 130, editable:false, hide:true },
    { id: 'password', field: 'password', headerName: 'p', width: 130, editable:false, hide:true },
    {
      id: 'deleteButton',
      field: 'deleteButton',
      headerName: ' ',
      width: 130,
      renderCell: (deleteId) => (
        <strong>
          <Button variant="outlined" color="error" startIcon={<Delete/>} aria-label="delete" onClick={(e)=> {deleteValue(deleteId)}}>
              Deletar
          </Button>
        </strong>
      ),
    },
  ];

  const [editLine, setLine] = useState(initial);
  const [createLine, setCreateLine] = useState(initial);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleCloseCreate = () => setOpenCreate(false);


  function changeInputEdit (event: React.ChangeEvent<HTMLInputElement>){
      const {name, value} = event.target;
      setLine({ ...editLine, [name]: value} );
  };

  function changeInputCreate (event: React.ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setCreateLine({ ...createLine, [name]: value} );
  };

  const handleOpen = (row) => {
    setOpen(true);
    setLine(row);
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
    setCreateLine(initial);
  };

  const updateValue = (e) => {
      e.preventDefault();

      var user = new User();
      user.id = editLine.id;
      user.email = editLine.email;
      user.name = editLine.name;
      user.type = Number(editLine.type);
      user.createdAt = new Date(editLine.createdAt);
      user.updatedAt = new Date(editLine.updatedAt);
      user.password = editLine.password;
      
      fetch('../../../api/servicos/User/userService', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              user
          }),
      }).then((r) => {
          return r.json();
      })
      .then((data) => {
          if(data.error){
            var message = "";
            for (var key of Object.keys(data.error)) {
              var val = data.error[key];
              message += val + "; ";
            }
            setEditError(message);
          }else if(data)
          {
              handleClose();
              users();
          }
      });
  };

  const createValue = (e) => {
    e.preventDefault();

    var user = new User();
    user.id = 0;
    user.email = createLine.email;
    user.name = createLine.name;
    user.type = Number(createLine.type);
    user.createdAt = new Date(createLine.createdAt);
    user.updatedAt = new Date(createLine.updatedAt);
    user.password = createLine.password;
    
    fetch('../../../api/servicos/User/userService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user
        }),
    }).then((r) => {
        return r.json();
    })
    .then((data) => {
        if(data.error){
          var message = "";
          for (var key of Object.keys(data.error)) {
            var val = data.error[key];
            message += val + "; ";
          }
          setCreateError(message);
        }else if(data)
        {
            handleCloseCreate();
            users();
        }
    });

  };

  const users = function(){
    fetch('../../../api/servicos/User/userService', 
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }}).then((r) => {
            return r.json();
            })
            .then((data) => {
                if (data && data.error) {
                    setRows([]);
                }else{
                    setRows([]);
                }
                if (data && data.Users) {
                    setRows(data.Users);
                }
    });
  }

  const deleteValue = (deleteId) => {
    
    fetch('../../../api/servicos/User/userService', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: deleteId
        }),
    }).then((r) => {
        return r.json();
    })
    .then((data) => {
        if(data)
        {
          users();
        }
    });
  
  };



  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(()=>{

    users();
      
  },[]);

  return (
    <DashboardLayout>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "80vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.filter(function(column){
                    if(column["hide"] && column["hide"] === true){
                      return false;
                    }
                    return true;
                  }).map((column) => (
                    <TableCell
                      key={column.id}
                      //align={column.align}
                      style={{ minWidth: column.width }}
                    >
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        onDoubleClick={(e)=> {handleOpen(row)}}
                      >
                        {columns.filter(function(column){
                          if(column["hide"] && column["hide"] === true){
                            return false;
                          }
                          return true;
                        }).map((column) => {
                          const value = row[column.id]? row[column.id] : column.renderCell ? column.renderCell(row.id) : "";
                          return (
                            <TableCell key={column.id}
                                      //align={column.align}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button variant="contained" style={{backgroundColor: "secondary"}} size="large" endIcon={<AddBox />} onClick={handleOpenCreate}>
            Novo Usuário
          </Button>
        </Paper>

        <div>
        <Modal
            open={openCreate}
            onClose={handleCloseCreate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box component="form" alignItems="center" sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 2fr)'}}>
                  <Item><Typography variant="h4" align="center">Novo Usuário</Typography></Item>
                  <Item>
                      <TextField variant="outlined" label="Nome" key="0" fullWidth name="name" value={createLine.name} onChange={changeInputCreate}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}}/>
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Email" type="email" fullWidth name="email"  value={createLine.email} onChange={changeInputCreate}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}} />
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Tipo" type="number" fullWidth name="type" value={createLine.type} onChange={changeInputCreate}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}}/>
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Senha" type="password" fullWidth name="password" value={createLine.password} onChange={changeInputCreate}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}}/>
                  </Item>
                  <Item><Button color="secondary" size="large" variant = "contained" type="submit" onClick={createValue}>Salvar</Button></Item>
                  {createError && 
                  <Item><Typography paragraph align="center" color="error">{createError}</Typography></Item>}
                </Box>
            </Box>
        </Modal>
        </div>
        <div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box component="form" alignItems="center" sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 2fr)'}}>
                  <Item><Typography variant="h4" align="center">Editar Usuário</Typography></Item>
                  <Item>
                      <TextField variant="outlined" label="Nome" key="0" fullWidth name="name" value={editLine.name} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}}/>
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Email" type="email" fullWidth name="email"  value={editLine.email} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}} />
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Tipo" type="number" fullWidth name="type" value={editLine.type} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><MailOutline /></InputAdornment>),}}/>
                  </Item>
                  <Item><Button color="secondary" size="large" variant = "contained" type="submit" onClick={updateValue}>Salvar</Button></Item>
                  {editError && 
                  <Item><Typography paragraph align="center" color="error">{editError}</Typography></Item>}
                </Box>
            </Box>
        </Modal>
        </div>

    </DashboardLayout>
  )
}

export default HomePage;