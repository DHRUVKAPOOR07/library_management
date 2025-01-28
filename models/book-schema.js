import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    publishedDate: {
        type: Date
    },
    availableCopies: {
        type: Number,
        default: 1,
        validate: {
            validator: function (value) {
                return value <= this.totalCopies;
            },
            message: "Available copies cannot exceed total copies"
        }
    },
    totalCopies: {
        type: Number,
        default: 1
    },
    borrowedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically

const Book = mongoose.model('Book', bookSchema);

export default Book;
