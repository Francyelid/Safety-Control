import React, {useEffect} from 'react';

import DashboardLayout from '../components/Layout';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { CheckCircle, Delete, Cancel  } from '@material-ui/icons';
import { debug } from 'console';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const columns = [
    { id: "status", label: "Status", minWidth: 170, 
    renderCell: (status: string) => (
      <strong>
        {status === 'true'? 
        <Button variant="outlined" color="error" startIcon={<Cancel/>} aria-label="delete" onClick={(e)=> {return null;}}>
            Pendente
        </Button>
        :
        <Button variant="outlined" color="success" startIcon={<CheckCircle/>} aria-label="delete" onClick={(e)=> {return null;}}>
            Resolvido
        </Button>
        }
      </strong>
    )
  },
    { id: "id", label: "Id", minWidth: 170 },
    { id: "epi", label: "EPI", minWidth: 170 },
    { id: "description", label: "Descrição", minWidth: 100 },
    {
      id: "start_date",
      label: "Data de Início",
      minWidth: 170,
      align: "right",
      format: (value) => value.toString()
    },
    {
      id: "end_date",
      label: "Data Final",
      minWidth: 170,
      align: "right",
      format: (value) => value.toString()
    }
  ];
  
  function createData(status, id, epi, description, start_date, end_date, start_image, end_image) {
    return {status, id, epi, description, start_date, end_date, start_image, end_image };
  }
  
   const TopsonList = ()=>{
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);
    const [controlArray, setControlArray] = React.useState([]);
    const [idSelected, setIdSelected] = React.useState(null);
    const [imageStartSelected, setImageStartSelected] = React.useState('');
    const [imageEndSelected, setImageEndSelected] = React.useState('');
    
    const [open, setOpen] = React.useState(false);

    const handleOpen = (item) => {
      
      fetch('../../api/servicos/Control/controlService?Id='+item.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((resultControl) => {
        return resultControl.json();
      }).then((data)=>{
        
        setImageStartSelected(data["result"][0].start_image);
        setImageEndSelected(data["result"][0].end_image);
        setOpen(true);
        setIdSelected(item.id);
      });
      
    }
    const handleClose = () => setOpen(false);

    useEffect(()=>{

      fetch('../../api/servicos/Control/controlService', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((resultControl) => {
        fetch('../../api/servicos/Epis/episService', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((resultEpi) => {
          resultEpi.json().then((resEpi) => {
            resultControl.json().then((resControl) => {
              
              let rows = resControl.map(function(row) { 
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   

                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false'
                return createData(statusControl,row["id"],epiFinded.name,row["description"],row["start_date"],row["end_date"],row["start_image"],row["end_image"]);
              })
              setControlArray(rows);
            })
          })
        })
      })
      
    },[]);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", position: 'relative',}}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    //align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {controlArray
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={function () {
                        handleOpen(row);
                      }}
                    >
                      {columns.map((column) => {
                        const value = column.renderCell ? column.renderCell(row[column.id]) : row[column.id]? row[column.id] : "";
                        return (
                          <TableCell key={column.id}
                                    //align={column.align}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
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
          rowsPerPageOptions={[7, 25, 50]}
          component="div"
          count={controlArray.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{display:'flex',alignItems:'center',justifyContent:'center'}}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx = {{
              //top: '50%',
              //left: '20%',
              margin:'auto',
              position: 'absolute',
              //transform: 'translate(-50%, -50%)',
              padding: 10,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              color: 'white',
              boxShadow: 24,
              p: 4
              //overflow: "hidden"
            }}>
              <Grid container spacing={2}
                >
                <h2>Id: {idSelected}</h2>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Item>
                    <h2>Imagem de Início</h2>
                    <img
                      width="550"
                      height="550"
                      alt='Imagem de Início'
                      src={'data:image/png;base64, '+imageStartSelected.substring(2,imageStartSelected.length-1)}
                      />
                  </Item>
                  <Item>
                    <h2>Imagem de Fim</h2>
                    {!imageEndSelected ? '' : 
                    <img
                      width="550"
                      height="550"
                      alt='Imagem de Fim'
                      src={'data:image/png;base64, '+imageEndSelected.substring(2,imageEndSelected.length-1)}
                    />}
                  </Item>
                </div>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    );
  }

  export default TopsonList;