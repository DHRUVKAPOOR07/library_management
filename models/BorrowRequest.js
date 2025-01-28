import mongoose from 'mongoose';

const borrowRequestSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    bookName: { type: String, required: true },
    availableCopies: { type: Number, required: true },
    totalCopies: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  },
  { timestamps: true } // Corrected syntax for the options object
);

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);
export default BorrowRequest;
