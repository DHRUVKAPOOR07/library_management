import Admin from "../models/admin-schema.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Create Admin
export const createAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }

        const hashedPass = await bcrypt.hash(password, 5);
        const isAdmin = await Admin.findOne({ username });

        if (isAdmin) {
            return res.status(409).json({ status: 'fail', message: 'User already exists' });
        }

        const newAdmin = new Admin({ username, password: hashedPass, email });
        await newAdmin.save();

        return res.status(201).json({ status: 'success', message: 'Admin created successfully' });

    } catch (error) {
        console.error("Error while creating the admin", error);
        return res.status(500).json({ status: 'fail', message: 'Error while creating the admin', error: error.message });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Email and password are required' });
        }
        const findAdmin = await Admin.findOne({ email });
        if (!findAdmin) {
            return res.status(401).json({ status: 'fail', message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, findAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'fail', message: 'Invalid username or password' });
        }

        const tokenPayload = { id: findAdmin._id, username: findAdmin.username };
        const token = jwt.sign(tokenPayload, process.env.secret_key, { expiresIn: '1d' });
        return res.status(200).json({
            status: 'success',
            token: `${token}`,
            Role : 'admin',
            user: { username: findAdmin.username, email: findAdmin.email }
        });

    } catch (error) {
        console.error("Error during admin login", error);
        return res.status(500).json({ status: 'fail', message: 'Error during admin login', error: error.message });
    }
};
