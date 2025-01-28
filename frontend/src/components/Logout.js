// src/components/Logout.js
import React from 'react';
import axios from 'axios';

const Logout = ({ setToken }) => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setToken(null);
            localStorage.removeItem('token');
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    return (
        <div className="text-center mt-5">
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
