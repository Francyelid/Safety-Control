import React from 'react';

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

const columns = [
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
  
  function createData(epi, description, start_date, end_date) {
    return { epi, description, start_date, end_date };
  }
  
  const rows = [
    createData("Máscara", "Máscara descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara Top", "Máscara Top descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara Topson", "Máscara Topson descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara comum", "Máscara comum descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara com brilho", "Máscara com brilho descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara com listras", "Máscara com listras descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara amarela", "Máscara amarela descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara de bolinhas", "Máscara de bolinhas descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara barata", "Máscara barata descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara azul", "Máscara azul descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara preta", "Máscara preta descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara para encher bolinha", "Máscara para encher bolinha descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara muito cara", "Máscara muito cara descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara de zumbi", "Máscara de zumbi descrição", "06/10/2021", "06/10/2021"),
    createData("Máscara de frankenstein", "Máscara de frankenstein descrição", "06/10/2021", "06/10/2021")
  ];
  
   const TopsonList = ()=>{
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);
  
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.epi}
                      onClick={function () {
                        handleOpen();
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
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
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              color: 'white',
              boxShadow: 24,
              p: 4
              //overflow: "hidden"
            }}>
              <h2>Imagem de Início</h2>
              <img
                alt='Imagem de Início'
                src={'https://www.reviewbox.com.br/wp-content/uploads/2019/07/homens-trabalhando-1024x658.jpg'}
              />
              <h2>Imagem de Fim</h2>
              <img
                alt='Imagem de Fim'
                src={'https://image.freepik.com/fotos-gratis/um-homem-forte-e-um-soldador-em-uma-mascara-de-solda-e-couro-de-soldador-um-produto-de-metal-e-soldado-com-uma-maquina-de-solda-na-garagem-faiscas-azuis-voam-para-os-lados_209729-664.jpg'}
              />
            </Box>
          </Fade>
        </Modal>
      </Paper>
    );
  }

  export default TopsonList;