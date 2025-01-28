import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Switch,
  TextField,
  Button,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BookIcon from "@mui/icons-material/Book";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Import Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"; // Import BarChart

const drawerWidth = 240;

const UserDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Charts");
  const [darkMode, setDarkMode] = useState(false);
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useTheme();
  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/getbooks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (response.ok) {
          setBooks(result.data);

          const username = localStorage.getItem("username");
          const borrowedResponse = await fetch(`http://localhost:8000/api/users/getBorrowedBooks?username=${username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          });

          const borrowedResult = await borrowedResponse.json();
          if (borrowedResponse.ok) {
            setBorrowedBooks(borrowedResult.books);
          } else {
            console.error(borrowedResult.message || "Failed to fetch borrowed books");
          }
        } else {
          console.error(result.message || "Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };

    fetchBooks();
  }, []);
//   console.log(books);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const fetchBorrowedBooks = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:8000/api/users/borrowed-books?username=${username}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setBorrowedBooks(data.books);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error.message);
    }
  };
  

  const handleBorrowBook = async (id) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        console.error("Username is not available in localStorage");
        return;
      }
  
      const response = await fetch(`http://localhost:8000/api/users/borrow-request?bookId=${id}&username=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        // Set the book status to 'Requested' in the frontend
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === id ? { ...book, status: "requested" } : book
          )
        );
        setBorrowedBooks((prevBorrowed) => [
          ...prevBorrowed,
          { ...result.book, status: "requested" },
        ]);
        console.log("Book borrow requested successfully:", result.message);
      } else {
        alert("This book is already borrowed by another user.");
        console.error(result.message || "Failed to request borrow");
      }
    } catch (error) {
      console.error("Error requesting borrow book:", error.message);
    }
  };
  

  const handleReturnBook = async (id) => {
    try {
      const username = localStorage.getItem("username");
      const response = await fetch(`http://localhost:8000/api/users/return?id=${id}&username=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      if (response.ok) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === id ? { ...book, isBorrowed: false } : book
          )
        );
        setBorrowedBooks((prevBorrowed) =>
          prevBorrowed.filter((book) => book._id !== id)
        );
      } else {
        console.error(result.message || "Failed to return book");
      }
    } catch (error) {
      console.error("Error returning book:", error.message);
    }
  };
  useEffect(() => {
    const fetchBookStatuses = async () => {
      try {
        const username = localStorage.getItem("username");
        const updatedBooks = await Promise.all(
          books.map(async (book) => {
            const response = await fetch(
              `http://localhost:8000/api/users/get-status?username=${username}&bookId=${book._id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            const result = await response.json();
            if (response.ok) {
              console.log(result.updatedAt);
              return { ...book, status: result.status };
            } else {
              console.error(`Failed to fetch status for book ${book.title}`);
              return { ...book, status: " " };
            }
          })
        );
        setBooks(updatedBooks);
      } catch (error) {
        console.error("Error fetching book statuses:", error.message);
      }
    };
  
    if (books.length > 0) {
      fetchBookStatuses();
    } 
  }, [books]);

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await fetch(`http://localhost:8000/api/users/getReturnedBooks?username=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (response.ok) {
          setReturnedBooks(result.books);
        } else {
          console.error(result.message || "Failed to fetch returned books");
        }
      } catch (error) {
        console.error("Error fetching returned books:", error.message);
      }
    };
  
    fetchReturnedBooks();
  }, []);
  console.log(returnedBooks);  
  const filteredBooks = books.filter((book) =>
    Object.values(book)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery)
  );
  const filteredBorrowedBooks = books
  .filter((book) => 
    borrowedBooks.some((borrowed) => borrowed === book.title) // Match based on `_id`
  )
  .map((book, index) => ({
    ...book,
    id: book._id || index, // Ensur/e each book has a unique `id`
  }));

  const columns = [
    { field: "sno", headerName: "S.No.", flex: 1 },
    // { field: "id", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "availableCopies", headerName: "Available Copies", flex: 1 },
    {
      field: "borrow",
      headerName: "Borrow a Book",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          disabled={params.row.status === "requested" || params.row.isBorrowed}
          onClick={() => handleBorrowBook(params.row._id)}
        >
          {params.row.status === "requested" ? "Requested" : "Borrow"}
        </Button>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let color;
        if (params.row.status === "Approved") {
          color = "green";
        }  if (params.row.status === "Rejected") {
          color = "red";
        }  if (params.row.status === "requested") {
          color = "orange";
        } 
        if(params.row.status==="Pending"){
          color = "red";
        }
        return (
          <span style={{ color: color, fontWeight: "bold" }}>
            {params.row.status || "Pending"}
          </span>
        );
      },
    },
    {
      field: 'statusUpdatedAt',
      headerName: 'Last Approved/Rejected At',
      width: 200,
      renderCell: (params) => {
        if (params.row.status === 'Approved') {
          return (
            <span style={{ color: 'green' }}>
              {new Date(params.row.updatedAt).toLocaleDateString()}
            </span>
          );
        } else if (params.row.status === 'Rejected') {
          return (
            <span style={{ color: 'red' }}>
              {new Date(params.row.updatedAt).toLocaleString()}
            </span>
          );
        } else {
          return null; // Or 'Pending' if you want to display that
        }
      },
    },
  ];
  

  const returnColumns = [
    {field:"sno",headerName:"S.No.",flex:1},
    // { field: "id", headerName: "ID", flex: 1 },
    ...columns.slice(1, 5),
    {
      field: "return",
      headerName: "Return a Book",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleReturnBook(params.row._id)}
        >
          Return
        </Button>
      ),
    },
  ];

  const returnedColumns = [
    { field: "sno", headerName: "S.No", flex: 1 }, 
    // { field: "bookId", headerName: "Book ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "returnedOn", headerName: "Returned On",flex:1},
  ];
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token from localStorage
    localStorage.removeItem("username"); // Optionally clear username if stored
    window.location.href="/front" // Redirect to login page
  };
  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {["Charts", "All Books", "Borrowed Books", "Returned Books"].map((text) => (
          <ListItem
            button
            key={text}
            onClick={() => setSelectedSection(text)}
            sx={{
              backgroundColor: selectedSection === text ? "#d3d3d3" : "transparent", // Add grey color for active item
              "&:hover": {
                backgroundColor: selectedSection === text ? "#b0b0b0" : "#f4f4f4", // Darker grey on hover for active
              },
            }}
          >
            <BookIcon sx={{ marginRight: 2 }} />
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  

  // Data for the pie chart (borrowed vs available)
  const chartData = [
    { name: "Borrowed", value: borrowedBooks.length },
    { name: "Available", value: books.filter((book) => !book.isBorrowed).length },
  ];

  // Data for the bar chart (categories)
  const categoryData = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(categoryData).map((category) => ({
    name: category,
    value: categoryData[category],
  }));
//   console.log()
  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex",ml:5 }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              User Dashboard
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            <p style={{margin:"20px",fontSize:"20px"}}>Welcome, {localStorage.getItem("username")}</p>
            <Avatar src="/profile-pic-url.jpg" sx={{ marginRight: 2 }} />
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="default"
            />
            <Button
              color="inherit"
              onClick={handleLogout} // Attach handleLogout function to the button
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <TextField
            label="Search Books"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleSearchChange}
          />

          {/* Display charts first */}
          {selectedSection === "Charts" && (
            <Box>
              {/* Pie chart for Borrowed vs Available */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >

                    <Cell fill="#82ca9d" />
                    <Cell fill="#ff7300" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Bar chart for Book Categories */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        
          {/* Display books data for other sections */}
          {selectedSection === "All Books" && (
                <DataGrid
                    rows={filteredBooks.map((book, index) => ({
                    sno: index + 1,  // Initialize sno
                    id: book._id,    // Ensure id is mapped
                    ...book,         // Spread other book properties
                    }))}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                />
                )}

            {selectedSection === "Borrowed Books" && (
          <DataGrid
          getRowId={(row) => row._id}
          rows={filteredBorrowedBooks.map((book, index) => ({
            sno: index + 1, 
            ...book,
            }))}
          columns={returnColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
      />)}
            
      
            {selectedSection === "Returned Books" && (
            <DataGrid
            rows={returnedBooks.map((book, index) => ({
              id: `${book.bookId}-${book.returnedOn}-${index}`,
              sno: index + 1, // Sequential S.No.
              ...book,
            }))}
                columns={returnedColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                getRowId={(row) => row.id} // Ensure the ID is unique
            />
            )}


        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserDashboard;
