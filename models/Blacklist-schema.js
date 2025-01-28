import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true, // Ensure each token is stored only once
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist;
