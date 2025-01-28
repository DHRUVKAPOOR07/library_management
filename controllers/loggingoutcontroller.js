import Blacklist from '../models/Blacklist-schema.js';
import jwt from 'jsonwebtoken';

export const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: 'fail', message: 'No token provided' });
        }

        // Decode the token
        let decoded;
        try {
            decoded = jwt.decode(token);
        } catch (error) {
            return res.status(400).json({ status: 'fail', message: 'Invalid token' });
        }

        // If decoding fails or token has no expiration
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ status: 'fail', message: 'Invalid or expired token' });
        }

        const expiresAt = new Date(decoded.exp * 1000);

        // Check if the token is already blacklisted
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(400).json({ status: 'fail', message: 'Token is already blacklisted' });
        }

        // Add the token to the blacklist
        const blackListedToken = new Blacklist({ token, expiresAt });
        await blackListedToken.save();

        return res.status(200).json({ status: 'success', message: 'User logged out successfully' });
    } catch (error) {
        console.error("Error while logging out", error);
        return res.status(500).json({ status: 'fail', message: 'Error while logging out', error: error.message });
    }
};
