import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DraggableDialog from './DraggableDialog'; // Import the dialog component

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);  // Define the open state for the dialog

  // Fetch data from the server
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/getbooks',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            }
        }); // Replace with your actual API endpoint
        const result = await response.json();
        if (response.ok) {
          setBooks(result.data);
        } else {
          console.error(result.message || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error.message);
      }
    };
    fetchBooks();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery) ||
    book.author.toLowerCase().includes(searchQuery),
  );

  const visibleRows = React.useMemo(
    () =>
      [...filteredBooks]
        .sort((a, b) =>
          order === 'asc'
            ? a[orderBy].localeCompare(b[orderBy])
            : b[orderBy].localeCompare(a[orderBy]),
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredBooks, order, orderBy, page, rowsPerPage],
  );

  const handleAddBook = async (newBook) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/addbook', { // Ensure your backend route is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token") // Replace with your actual token
        },
        body: JSON.stringify(newBook),
      });
      const result = await response.json();
      if (response.ok) {
        setBooks((prevBooks) => [...prevBooks, result.book]);
      } else {

        console.error(result.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  };

  return (
    <Box sx={{ width: '1280px', marginLeft: "-320px", marginTop: "-30px" }}>
      <Paper sx={{ width: '1280px', mb: 2, p: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }}>
          <Typography variant="h6" id="tableTitle" component="div" sx={{ flex: '1 1 100%' }}>
            Books
          </Typography>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, width: '500px' }}
          />
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {/* Add S.No. header */}
                <TableCell align="left">S.No.</TableCell>
                {['title', 'author', 'category', 'availableCopies', 'totalCopies', 'createdAt', 'updatedAt'].map((header) => (
                  <TableCell key={header} align="left" sortDirection={orderBy === header ? order : false}>
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : 'asc'}
                      onClick={(event) => handleRequestSort(event, header)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((book, index) => {
                const serialNumber = page * rowsPerPage + index + 1;
                return (
                  <TableRow hover tabIndex={-1} key={book.id}>
                    <TableCell align="left">{serialNumber}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell align="left">{book.author}</TableCell>
                    <TableCell align="left">{book.category}</TableCell>
                    <TableCell align="left">{book.availableCopies}</TableCell>
                    <TableCell align="left">{book.totalCopies}</TableCell>
                    <TableCell align="left">{new Date(book.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="left">{new Date(book.updatedAt).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />} label="Dense padding" />
      <Stack spacing={2} direction="row" style={{ marginLeft: "1100px",marginTop:"-25px" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Book</Button>
      </Stack>
      <DraggableDialog open={open} handleClose={() => setOpen(false)} handleAddBook={handleAddBook} />
    </Box>
  );
}
