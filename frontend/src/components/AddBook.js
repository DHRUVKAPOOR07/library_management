// src/components/AddBook.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        category: '',
        publishedDate: '',
        availableCopies: 1,
        totalCopies: 1,
    });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            // Replace this with the actual token you receive during login
            const token = localStorage.getItem('token'); // Assuming you're storing it in localStorage
    
            const response = await axios.post('http://localhost:8000/api/users/addbook', bookData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token here
                },
            });
    
            setSuccess('Book added successfully!');
            setBookData({ title: '', author: '', category: '', publishedDate: '', availableCopies: 1, totalCopies: 1 });
        } catch (err) {
            console.error(err);
            // You can also update the state to show error messages
        }
    };
    

    return (
        <div className="container mt-5">
            <h2 className="text-center">Add Book</h2>
            <form onSubmit={handleAddBook} className="border p-4 shadow rounded">
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Book Title"
                        value={bookData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="author"
                        className="form-control"
                        placeholder="Author"
                        value={bookData.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="category"
                        className="form-control"
                        placeholder="Category"
                        value={bookData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="publishedDate"
                        className="form-control"
                        value={bookData.publishedDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="availableCopies"
                        className="form-control"
                        placeholder="Available Copies"
                        value={bookData.availableCopies}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="totalCopies"
                        className="form-control"
                        placeholder="Total Copies"
                        value={bookData.totalCopies}
                        onChange={handleChange}
                        required
                    />
                </div>
                {success && <p className="text-success">{success}</p>}
                <button type="submit" className="btn btn-primary btn-block">Add Book</button>
            </form>
        </div>
    );
};

export default AddBook;
