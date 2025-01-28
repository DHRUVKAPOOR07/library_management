import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import AdminNavigation from './components/DashboardLayoutBranding'; 
import DashboardLayoutAccountSidebar from './components/DashboardLayoutBranding'; 
import EnhancedTable from './components/EnhancedTable';
import UserDashboard from './components/UserDashboard';
import AccessDenied from './components/AccessDenied'; // Import Access Denied Page
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import Toastify styles
import FrontPage from './components/FrontPage';
import UsersTable from './components/UsersTable';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token").substring(7) : null);
  const userRole = localStorage.getItem("role");

  return (
    <Router>
      <div className="container">
        <Routes>


          {!token ? (
            <>
            <Route path="/front" element={<FrontPage />} />

              <Route path="*" element={<Navigate to="/front" />} />
              <Route path="/front" element={<FrontPage />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/Signin" element={<Signin />} />
            </>
          ) : (
            <>
              {/* Admin Routes */}
              {userRole === 'admin' ? (
               
                <Route element={<AdminNavigation />}>
                  <Route path="/" element={<DashboardLayoutAccountSidebar />} />
                  <Route path="/adminCharts" element={<EnhancedTable />} />
                  <Route path="/edit-books" element={<EnhancedTable />} />
                  <Route path="/borrow-list" element={<EnhancedTable />} />
                  <Route path="/user-list" element={<UsersTable />} />
                  <Route path="/borrowreq-list" element={<EnhancedTable />} />
  
                </Route>
              ) : (
                <Route path="/admin/*" element={<Navigate to="/access-denied" />} /> // Redirect if user tries to access admin routes
              )}

              {/* User Routes */}
              {userRole === 'User' && <Route path='/user' element={<UserDashboard />} />}
              {userRole === 'admin' && <Route path='*' element={<Navigate to="/adminCharts" />} />}
              {/* Access Denied Route */}
              {userRole==='User' && <Route path="/" element={<AccessDenied />} />}
              {userRole==='User' && <Route path="/adminCharts" element={<AccessDenied />} />}
              {userRole==='User' && <Route path="/edit-books" element={<AccessDenied />} />}
              {userRole==='User' && <Route path="/borrow-list" element={<AccessDenied />} />}
              {userRole==='User' && <Route path="/user-list" element={<AccessDenied />} />}
              {userRole==='User' && <Route path="/borrowreq-list" element={<AccessDenied />} />}


              {userRole === 'User' && <Route path='*' element={<Navigate to="/user" />} />}
            </> 
          )}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
