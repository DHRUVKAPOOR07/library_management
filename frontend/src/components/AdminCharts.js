import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  Grid,
  CssBaseline,
  Paper,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const AdminCharts = () => {
  const [users, setUsers] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [requestStatusData, setRequestStatusData] = useState([]);
  const [userRequestData, setUserRequestData] = useState([]);
  const [requestTrendsData, setRequestTrendsData] = useState([]);
  const [topUsersData, setTopUsersData] = useState([]);

  const theme = useTheme();
  const customTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const userResponse = await fetch("http://localhost:8000/api/users/getusers");
        const usersData = await userResponse.json();
        setUsers(usersData.data || []);

        // Fetch all borrow requests
        const requestResponse = await fetch("http://localhost:8000/api/users/borrow-requests");
        const requestsData = await requestResponse.json();
        setBorrowRequests(requestsData.data || []);

        // Process data for charts
        processChartData(usersData.data || [], requestsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const processChartData = (users, requests) => {
    // Borrow requests by status
    const statusCounts = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
    setRequestStatusData(Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    })));

    // Requests per user
    const userRequestCounts = users.map((user) => {
        const userRequests = requests.filter(
            (req) => req.userId === user._id
          );
          
      return { name: user.username, value: userRequests.length };
    });
    console.log(userRequestCounts);
    setUserRequestData(userRequestCounts);

    // Borrow request trends (group by date)
    const trends = requests.reduce((acc, request) => {
      const date = new Date(request.createdAt).toLocaleString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    setRequestTrendsData(Object.keys(trends).map((date) => ({
      date,
      count: trends[date],
    })));

    // Top users by request count
    const topUsers = [...userRequestCounts]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    setTopUsersData(topUsers);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard - Advanced Borrow Request Statistics
        </Typography>
        <Grid container spacing={3}>
          {/* Pie Chart: Borrow Requests by Status */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Borrow Requests by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={requestStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {requestStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Bar Chart: Requests Per User */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Borrow Requests Per User
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userRequestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Line Chart: Borrow Requests Over Time */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Borrow Requests Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={requestTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Horizontal Bar Chart: Top Users */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Top 5 Users by Borrow Requests
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsersData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminCharts;
