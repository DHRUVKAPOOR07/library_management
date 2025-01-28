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

export default function UsersTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [books, setBooks] = useState([]);
  const [userBorrowedBooks, setUserBorrowedBooks] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);  // Define the open state for the dialog
  const[username,setusername] = useState("");
  // Fetch data from the server
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/getusers',{
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

  //2nd function
  const fetchBorrowedBooks = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/getBorrowedBooks?username=${username}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        }
      });
      const result = await response.json();
  
      if (response.ok) {
        // Store the result in a state mapped by username
        setUserBorrowedBooks((prevState) => ({
          ...prevState,
          [username]: result.books, // Store the array of book titles
        }));
      } else {
        console.error(result.message || 'Failed to fetch borrowed books');
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error.message);
    }
  };
  
  const handleDelete = async (id) => {
    try {
        console.log(id);
        const response = await fetch(`http://localhost:8000/api/users/delete?userId=${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            const data = await response.json();  // Parsing JSON response
            console.log("User deleted successfully", data);
        } else {
            alert("Something went wrong. Please try again later");
            const errorData = await response.json();  // Parsing error response if status is not OK
            console.log("Something went wrong", errorData.message || errorData);
        }
    } catch (error) {
        console.log("Error in deleting the user", error.message);
    }
};

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredBooks = books.filter((book) =>
    (book.username ? book.username.toLowerCase() : '').includes(searchQuery) ||
    (book.password ? book.password.toLowerCase() : '').includes(searchQuery) ||
    (book.email ? book.email.toLowerCase() : '').includes(searchQuery) 
    // (book.email ? book.email.toLowerCase() : '').includes(searchQuery)
  );
  useEffect(() => {
    books.forEach((user) => {
      if (!userBorrowedBooks[user.username]) {
        fetchBorrowedBooks(user.username);
      }
    });
  }, [books]); // Dependency on the books array
  
  const getValue = (row, property) => {
    if (typeof row[property] === 'string') {
      return row[property].toLowerCase();
    }
    return row[property];  // for numbers or other types
  };
  
  const visibleRows = React.useMemo(
    () =>
      [...filteredBooks]
        .sort((a, b) => {
          const aValue = a[orderBy] || '';  // Default to an empty string if the value is undefined
          const bValue = b[orderBy] || '';  // Default to an empty string if the value is undefined
          return order === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredBooks, order, orderBy, page, rowsPerPage]
  );
  
 
  return (
    <Box sx={{ width: '1280px', marginLeft: "-320px", marginTop: "-25px" }}>
      <Paper sx={{ width: '1280px', mb: 2, p: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }}>
          <Typography variant="h6" id="tableTitle" component="div" sx={{ flex: '1 1 100px' }}>
            Users
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
                {['username', 'email', 'borrowed books','Last Login','Delete User'].map((header) => (
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
      {visibleRows.map((user, index) => {
        const serialNumber = page * rowsPerPage + index + 1;
        const borrowedBooks = userBorrowedBooks[user.username]?.join(', ') || 'No books borrowed';

    return (
        
      <TableRow hover tabIndex={-1} key={user.username}>
        <TableCell align="left">{serialNumber}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell align="left">{user.email}</TableCell>
        <TableCell align="left">{borrowedBooks}</TableCell> {/* Display borrowed books */}
        <TableCell align="left">{user.LastLogin}</TableCell>
        <IconButton
            color="error"
            onClick={() => handleDelete(user._id)}
        >
          <DeleteIcon />
        </IconButton>
        
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

    </Box>
  );
}
