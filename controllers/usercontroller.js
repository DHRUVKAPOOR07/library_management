import User from "../models/user-schema.js";
import bcrypt from 'bcrypt';
import { errorMonitor } from "events";
import jwt from 'jsonwebtoken';
// import User from '../models/user-schema.js'
import Book from "../models/book-schema.js";
// Create User
export const createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }
        const isUser = await User.findOne({ username });
        if (isUser) {
            return res.status(409).json({ status: 'fail', message: 'User already exists' });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPass,
            email
        });
        await newUser.save();
        return res.status(201).json({ status: 'success', user: { _id: newUser.id, username, email } });
    } catch (error) {
        console.error("Error while creating user", error);
        return res.status(500).json({ status: 'fail', message: 'Error while creating user', error: error.message });
    }
};

// User Login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Username and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid username or password' });
        }
        const tokenPayload = { id: user._id, username: user.username };
        const token = jwt.sign(tokenPayload, process.env.secret_key, { expiresIn: '1h' });
        user.LastLogin = new Date();
        await user.save();
        return res.status(200).json({
            status: 'success',
            token: `Bearer ${token}`,
            Role:"User",
            user: { username: user.username, email: user.email,LastLogin:new Date()}
        });
    } catch (error) {
        console.error("Error during user login", error);
        return res.status(500).json({ status: 'fail', message: 'Error during login', error: error.message });
    }
};



// Edit User
export const editUser = async (req, res) => {
    try {
        const { userId, updates } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error("Error while updating user", error);
        return res.status(500).json({ status: 'fail', message: 'Error while updating user', error: error.message });
    }
};
export const getusers = async(req,res) =>{
    try {
        const user =await User.find();
        return res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.log("there is an error while fetching users");
        return res.status(500).json({ status: 'fail', message: 'Error while fetching'
        });
    }
}
export const deleteUser = async (req, res) => {
    const { userId } = req.query;
    console.log(userId);
    try {
        if (!userId) {
            console.log("Please provide the userId");
            return res.status(400).json({
                status: "fail",
                message: "userId is required to delete the user"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({
                status: "fail",
                message: "User not found with the given id"
            });
        }

        const username = user.username;
        const borrowedBooks = user.borrowedBooks;


        const deletedUser = await User.findByIdAndDelete(userId);

        //here i am updating the book section
        if (borrowedBooks && borrowedBooks.length > 0) {
            for (let bookId of borrowedBooks) {
                await Book.updateMany(
                    { borrowedbooks: bookId },
                    { $pull: { borrowedbooks: bookId } }
                );
            }
        }

        if (deletedUser) {
            console.log("User deleted successfully");
            return res.status(200).json({
                status: "success",
                message: "User deleted successfully",
                data: { username }
            });
        }

    } catch (error) {
        console.log("Error in deleting the user", error.message);
        return res.status(500).json({
            status: "fail",
            message: "Error in deleting the user",
            error: error.message
        });
    }
};
