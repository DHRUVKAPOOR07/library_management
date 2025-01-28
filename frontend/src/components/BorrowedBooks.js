import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

export default function BorrowedBooks() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/getTillNow", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (response.ok) {
          setUsers(result.data);
        } else {
          console.error(result.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  // Handle sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter and sort data
  const filteredUsers = users.filter(
    (user) =>
      (user.username || "").toLowerCase().includes(searchQuery) ||
      (user.title || []).some((book) =>
        book.title.toLowerCase().includes(searchQuery)
      )
  );

  const visibleRows = [...filteredUsers]
    .sort((a, b) => {
      const aValue = a[orderBy] || "";
      const bValue = b[orderBy] || "";
      return order === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: "100%",marginLeft:"-319px",mt: -2}}>
      <Paper sx={{ width: "1300px", mb: 2, p: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }}
        >
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
            sx={{ flex: "1 1 100px" }}
          >
            Borrowed Books
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
            sx={{ width: "400px" }}
          />
        </Toolbar>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="left">S.No.</TableCell>
                {["Username", "Title", "Borrowed On","Returned On"].map((header) => (
                  <TableCell
                    key={header}
                    align="left"
                    sortDirection={orderBy === header.toLowerCase() ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === header.toLowerCase()}
                      direction={orderBy === header.toLowerCase() ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, header.toLowerCase())}
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
                const titles = user.title.length
                  ? user.title.map((book) => book.title).join(", ")
                  : "No books borrowed";
                const borrowedOn = user.title.length
                  ? user.title.map((book) => book.borrowedOn).join(", ")
                  : "Null";

                return (
                  <TableRow hover tabIndex={-1} key={user.username}>
                    <TableCell align="left">{serialNumber}</TableCell>
                    <TableCell align="left">{user.username}</TableCell>
                    <TableCell align="left">{titles}</TableCell>
                    <TableCell align="left">{borrowedOn}</TableCell>
                    <TableCell align="left">{"21/01/2025"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>
    </Box>
  );
}
