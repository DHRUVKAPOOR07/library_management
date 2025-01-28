import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { type } from 'os';
// import { borrowedBooks } from '../controllers/bookcontroller';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    LastLogin:{
        type: Date,
    },
    borrowedBooks:{
        type: Array,
        ref: 'Book',
    },
    returnedBooks:{
        type: Array,
        ref: 'Book',
    },
    borrowedTillNow:{
        type: Array,
        ref: 'Book',
    }
    ,
    returnedOn:{
        type: Date,
    }

});

const User = mongoose.model('User', userSchema);
export default User;
