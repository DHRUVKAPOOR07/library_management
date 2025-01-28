import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import BorrowRequest from './BorrowRequest';
import EnhancedTable from './EnhancedTable'; // Import your All Books table component
import UsersTable from './UsersTable';
import EditableTable from './EditableTable';
import BorrowedBooks from './BorrowedBooks';
import AdminCharts from './AdminCharts';

const drawerWidth = 240;

function AdminNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
           { text: 'Charts', icon: <BookIcon />, link: '/adminCharts' },
          { text: 'All Books', icon: <BookIcon />, link: '/' },
          { text: 'Edit Books', icon: <EditIcon />, link: '/edit-books' },
          { text: 'Borrow List', icon: <ListAltIcon />, link: '/borrow-list' },
          { text: 'User List', icon: <PeopleIcon />, link: '/user-list' },
          { text: 'Borrow requests', icon: <ListAltIcon />, link: '/borrowreq-list' },
        ].map((item, index) => (
          <ListItem button component={Link} to={item.link} key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token from localStorage
    localStorage.removeItem("username"); // Optionally clear username if stored
    window.location.href="/front"; // Redirect to login page
  };

  return (
    <Box sx={{ display: 'flex',ml:11,mt:2 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px}` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* This takes all the space to push the button to the right */}
          <Button
            color="inherit"
            onClick={handleLogout} // Attach handleLogout function to the button
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Routes>
          <Route path="*" element={<AdminCharts />} />
          <Route path="/" element={<EnhancedTable />} />
          <Route path="/adminCharts" element={<AdminCharts />} />
          <Route path="/edit-books" element={<EditableTable />} />  
          <Route path="/borrow-list" element={<BorrowList />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/borrowreq-list" element={<Borrowreq />} />
        </Routes>
      </Box>
    </Box>
  );
}

// Placeholder components for the routes
function BorrowList() {
  return (
    <BorrowedBooks/>
  );
}

function UserList() {
  return <UsersTable />;
}
function Borrowreq(){
  return <BorrowRequest/>

}


export default AdminNavigation;
