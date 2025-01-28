import User from "../models/user-schema.js";
import Book from "../models/book-schema.js";
import BorrowRequest from "../models/BorrowRequest.js";
import mongoose from "mongoose";
export const borrowBook = async (req, res) => {
    try {
        const { id, username } = req.query;
        console.log(id);
        // Check if the required query parameters are provided
        if (!id || !username) {
            return res.status(400).json({
                status: 'fail',
                message: 'Book ID and username are required',
            });
        }

        console.log("Username:", username);

        // Use `findById` correctly (no need for an object)
        const book = await Book.findOne({title:id});
        if (!book) {
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found',
            });
        }

        if (book.availableCopies < 1) {
            return res.status(400).json({
                status: 'fail',
                message: 'No more available copies',
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        // Check if the user already borrowed this book
        if (book.borrowedBy.some((borrowedId) => borrowedId.equals(user._id))) {
            return res.status(400).json({
                status: 'fail',
                message: 'This book is already borrowed by this user. Only one copy per user is allowed.',
            });
        }

        // Update book and user data
        book.borrowedBy.push(user._id); // Allow multiple borrowers
        user.borrowedBooks = user.borrowedBooks || [];
        user.borrowedBooks.push(book._id);
        user.borrowedTillNow = user.borrowedTillNow || [];
        user.borrowedTillNow.push({title:book.title,borrowedOn:new Date().toLocaleString()});
        // Decrement available copies and save changes
        book.availableCopies -= 1;
        await book.save();
        await user.save();
        console.log("Borrowed success");

        return res.status(200).json({
            status: 'success',
            message: 'Book borrowed successfully',
            user,
            book,
        });
    } catch (error) {
        console.error("There was an error while borrowing a book:", error);
        return res.status(500).json({
            status: 'fail',
            message: 'Error while borrowing the book',
            error: error.message,
        });
    }
};


export const returnBook = async (req, res) => {
    try {
        const { id, username } = req.query;
        console.log(username);
        // Check if the required query parameters are provided
        if (!id || !username) {
            return res.status(400).json({
                status: 'fail',
                message: 'Book ID and username are required',
            });
        }

        console.log("Username:", username);

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found',
            });
        }
        const user = await User.findOne({username});

        
        if (!book.borrowedBy.some(borrowerId => borrowerId.equals(user._id))) {
            return res.status(403).json({
                status: 'fail',
                message: 'User does not have this book borrowed'
            });
        }
        book.borrowedBy = book.borrowedBy.filter(
            (borrowerId) => !borrowerId.equals(user._id)
        );
        user.borrowedBooks = user.borrowedBooks.filter(
            (borrowedBookId) => !borrowedBookId.equals(book._id)
        );
        // Update available copies of the book
        if (book.availableCopies < book.totalCopies) {
            book.availableCopies += 1;
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Available copies cannot exceed total copies"
            });
        }
        user.returnedBooks = user.returnedBooks || [];
        user.returnedBooks.push({ bookId: book._id, returnedOn: new Date().toLocaleString() });
        // Save changes to book and user documents
        await book.save();
        await user.save();
        console.log("Book returned successfully");
        return res.status(200).json({
            status: 'success',
            message: 'Book returned successfully',
            bookId:book.id
        });
    } catch (error) {
        console.log("There was an error while returning the book: ", error);
        return res.status(500).json({
            status: 'fail',
            message: 'Error while returning the book',
            error: error.message
        });
    }
};
export const borrowedBooks = async (req, res) => {
    try {
      const { username } = req.query;  // Use req.query instead of req.body
      if (!username) {
        return res.status(404).json({
          status: 'fail',
          message: 'Username is required'
        });
      }
      console.log(username);
      
      const user = await User.findOne({username});
      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'User not found'
        });
      }
      const bookId = user.borrowedBooks;
      const books = await Book.find({ _id: { $in: bookId } });
      const bookTitles = books.map(book => book.title);
      return res.status(200).json({
        status: 'success',
        books: bookTitles// Ensure this matches your schema field
   
      });
    } catch (error) {
      console.log("There was an error while fetching the lists of books ", error);
      return res.status(500).json({
        status: 'fail',
        message: 'Error while fetching the books',
        error: error.message
      });
    }
  };
  //The books which are returned
  export const returnedBooks = async (req, res) => {
    try {
      const { username } = req.query; // Use req.query for username
      if (!username) {
        return res.status(400).json({
          status: 'fail',
          message: 'Username is required',
        });
      }
  
      console.log(`Fetching returned books for username: ${username}`);
  
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }
      const bookIds = user.returnedBooks.map((entry) => entry.bookId);
  
      const books = await Book.find({ _id: { $in: bookIds } });
  
      // Combine book details with returnedOn dates
      const returnedBooksDetails = user.returnedBooks.map((entry) => {
        const book = books.find(
          (b) => b._id?.toString() === entry.bookId?.toString()
        );
  
        return {
          bookId: entry.bookId,
          category:book.category,
          returnedOn: entry.returnedOn,
          title: book?.title || 'Unknown Title',
          author: book?.author || 'Unknown Author',
        };
      });
  
      // Send response with detailed book information
      return res.status(200).json({
        status: 'success',
        books: returnedBooksDetails,
      });
    } catch (error) {
      console.error('Error while fetching the list of returned books:', error);
      return res.status(500).json({
        status: 'fail',
        message: 'An error occurred while fetching the books',
        error: error.message,
      });
    }
  };
  
  
//book ko add krra hu

export const addBook = async (req, res) => {
    try {
        const newBook = new Book(req.body); // Assuming req.body contains all necessary fields
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: 'Error adding book', error: error.message });
    }
};
// idr remove krra hu book ko
export const removeBook = async(req,res) => {
    try {
        const {bookId} = req.body;
        console.log(`Received bookId: ${bookId}`);
        const deleteBook = await Book.findByIdAndDelete(bookId);
        if(!deleteBook){
            return res.status(404).json({
                status:'fail',
                message:'Book not found'
            });
        }
        await User.updateMany( //idr sb users k borrowed section s vo book remove hori h
            { borrowedbooks: bookId },
            { $pull: { borrowedbooks: bookId } }
        );
        return res.status(200).json({
            status:'success',
            message:'book removed successfully'
        });
        
    } catch (error) {
        console.log('There is an error while removing the book ',error);
        return res.status(400).json({
            status:'fail',
            message:'Error while removing the book',
            error:error.message
        });
    }
}
export const increaseCopies = async(req,res) =>{
    try {
        const {bookId, number} = req.body;
        if (!bookId || typeof number !== 'number') {
            return res.status(400).json({
                status: 'fail',
                message: 'Book ID and number of copies to add are required'
            });
        }
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(400).json({
                status:'fail',
                message:'Book not found'
            });
        }
        book.availableCopies += number;
        book.totalCopies += number;
        await book.save();
        return res.status(200).json({
            status:'success',
            message:'number of available copies are changed successfully!',
            data:book   
        });
    } catch (error) {
        console.log("There was an error while changing the available copies ",error);
        return res.status(500).json({
            status:'Fail',
            message:'Error while changing the available copies',
            error:error.message
        });
    }
}
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books from the database
        return res.status(200).json({
            status: 'success',
            data: books
        });
    } catch (error) {
        console.log("There was an error while fetching the books ", error);
        return res.status(500).json({
            status: 'fail',
            message: 'Error while fetching books',
            error: error.message
        });
    }
};

export const updateBook = async (req, res) => {
    const { _id, title, author, category, availableCopies, totalCopies } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      _id, // Use _id to find the book
      { title, author, category, availableCopies, totalCopies },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    console.log("Book update successfully");
    res.status(200).json({ data: updatedBook });

  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};
//get all borrowed till books`
export const getBorrowedTillBooks = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        console.log(users);

        return res.status(200).json({
            status: "Success",
            data: users.map(user => ({
                // borrowedTillNow: {
                //     username:users.username,
                //     title: user.borrowedTillNow?.title || "Not", // Access `title` safely
                //     borrowedOn: user.borrowedTillNow?.borrowedOn || "Null" // Access `borrowedOn` safely
                // }
                username:user.username,
                title:user.borrowedTillNow||"Null",
                
            }))
        });
    } catch (error) {
        console.log("There is an error while fetching these getBorrowedTillBooks ", error);
        return res.status(500).json({
            status: "Fail",
            error: error.message
        });
    }
};
export const borrowrequesttt = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const request = await BorrowRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
  
      // Check if the status is already set to the new one to avoid unnecessary updates
      if (request.status === status) {
        return res.status(400).json({ success: false, message: 'Status is already ' + status });
      }
  
      // Update status and set the timestamp of when the status is updated
      request.status = status;
      request.updatedAt = new Date();  // Set the current timestamp
  
      await request.save();
  
      res.json({ success: true, message: `Request ${status} successfully!` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
export const borrowRequest = async(req,res) =>{
    const { bookId, username } = req.query;
    console.log(bookId);
  try {
    // Fetch book details
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No available copies for this book.' });
    }
    // Create a new Borrow Request
    const newRequest = new BorrowRequest({
      username,
      bookId: book._id,
      bookName: book.title,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: 'Borrow request created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
export const borrowRequestss = async(req,res) =>{
    try {
        const requs = await BorrowRequest.find();
        return res.status(200).json({
            status: "Success",
            data:requs
        })
    } catch (error) {
        console.log("There is an error while fetching : ",error);
        return res.status(500).json({
            status:"Fail",
            error:error.message
        })
    }
}
export const requeststatus = async (req, res) => {
    const { username, bookId } = req.query;
    
    try {
        // Fetch the latest borrow request for the given user and book, sorted by createdAt in descending order
        const request = await BorrowRequest.findOne({ username, bookId })
            .sort({ createdAt: -1 }) // Sort by createdAt descending to get the latest request
            .exec();
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Return the latest status
        res.status(200).json({ status: request.status });

    } catch (error) {
        console.log("Error in fetching the status: ", error);
        return res.status(500).json({
            status: "Fail",
            error: error.message
        });
    }
};
