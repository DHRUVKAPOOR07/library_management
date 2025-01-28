import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Grid,
  Skeleton,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

function BorrowRequests() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch borrow requests from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/users/borrow-requests")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const requests = Array.isArray(data.data) ? data.data : [];
        setBorrowRequests(requests);
      })
      .catch((err) => {
        console.error("Error fetching borrow requests:", err.message);
      });
  }, []);

  // Search filter handler
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const handleBorrow = async(username,id) =>{
    // const username = localStorage.getItem("username");
    // const username="test3";
    try {
        const response = await fetch(`http://localhost:8000/api/users/borrow?id=${id}&username=${username}`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            }
        });
        if(response.ok){
            // alert("Success");.
            toast.success("Success", {
                position: "top-right", // Position for error message
                autoClose: 5000, // Auto close after 5 seconds
                hideProgressBar: false, // Show progress bar
              });

        }
        else{
            toast.error( "Failed", {
                position: "top-right", // Position for error message
                autoClose: 5000, // Auto close after 5 seconds
                hideProgressBar: false, // Show progress bar
              });
        }
    } catch (error) {
        toast.error("Error: " + error, {
            position: "top-right", // Position for error message
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: false, // Show progress bar
          });
        // alert("Failed");
    }
   
  }

  const filteredRequests = borrowRequests.filter((request) =>
    request.bookName?.toLowerCase().includes(searchQuery)
  );

  // Function to handle Approve/Reject actions
  const handleAction = (id, bookname,username,action) => {
    fetch(`http://localhost:8000/api/users/borrow-request1/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: action }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Use toast for success notification
          toast.success(`Request ${action} successfully!`, {
            position: "top-right", // You can customize the position
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: false, // Show progress bar
          });
  
          if (action === "Approved") {
            handleBorrow(username,bookname);
          }
  
          setBorrowRequests((prev) =>
            prev.map((request) =>
              request._id === id ? { ...request, status: action } : request
            )
          );
        } else {
          // Use toast for error notification
          toast.error("Error: " + data.message, {
            position: "top-right", // Position for error message
            autoClose: 5000, // Auto close after 5 seconds
            hideProgressBar: false, // Show progress bar
          });
        }
      })
      .catch((error) => {
        console.error("Error handling request:", error);
        toast.error("Error: " + error.message, {
          position: "top-right", // Position for error message
          autoClose: 5000, // Auto close after 5 seconds
          hideProgressBar: false, // Show progress bar
        });
      });
  };
  
  const renderSkeletons = () => (
    <Grid container spacing={2}>
      {Array(5)
        .fill("")
        .map((_, index) => (
          <Grid item xs key={index}>
            <Skeleton variant="rectangular" width={300} height={50} />
          </Grid>
        ))}
    </Grid>
  );

  return (
    <Paper sx={{ width: "83vw", margin: "20px auto", padding: "20px",ml:-40,mt:-5 }}>
      {/* Toolbar with Search */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: (theme) => theme.palette.action.selected,
        }}
      >
        <Typography variant="h6">Borrow Requests</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Book Name..."
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
          No results found. Loading...
          {renderSkeletons()}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Approved/Rejected At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
    {filteredRequests.map((request, index) => (
    <TableRow key={request._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{request.bookName}</TableCell>
      <TableCell>{request.username}</TableCell>
      <TableCell>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: request.status === 'Approved' ? 'green' : request.status === 'Rejected' ? 'red' : 'black',
          }}
        >
          {request.status}
        </Typography>
      </TableCell>
      <TableCell>
  {request.status === "Pending" ? (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() =>
          handleAction(request._id, request.bookName,request.username ,"Approved")
        }
      >
        Approve
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() =>
          handleAction(request._id, request.bookName, request.username,"Rejected")
        }
        sx={{ marginLeft: 1 }}
      >
        Reject
      </Button>
    </>
  ) : (
    <Typography
      sx={{
        fontWeight: "bold",
        color: request.status === "Approved" ? "green" : "red",
      }}
    >
      {request.status}
    </Typography>

    
  )}
</TableCell>
<TableCell>

{request.status==="Approved"?(new Date(request.updatedAt).toLocaleString()):'' || request.status==="Rejected"?(new Date(request.updatedAt).toLocaleString()):' '}

</TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default BorrowRequests;
