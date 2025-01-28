import express from 'express';
import { borrowBook,borrowedBooks,getBooks,returnBook} from '../controllers/bookcontroller.js';
import {authenticateToken} from '../middleware/authentication.js';
const router = express.Router();

router.post('/borrow',borrowBook);
router.post('/return',returnBook);
router.get('/books',getBooks);
router.get('/borrowedbooks',borrowedBooks);
export default router;