import express from 'express';
// import adminonly from '../middleware/auth1.js';
// import auth1 from '../middleware/auth1.js';
import { addBook, removeBook,increaseCopies,updateBook, borrowedBooks, returnedBooks, getBorrowedTillBooks, borrowRequest, borrowRequestss, borrowrequesttt, requeststatus } from '../controllers/bookcontroller.js';
import  authenticateToken  from '../middleware/authentication.js';
import  authorizeAdmin  from '../middleware/authorization.js'; 
import BorrowRequest from '../models/BorrowRequest.js';

const router1 = express.Router();
router1.get("/getReturnedBooks",returnedBooks);
router1.get("/getBorrowedBooks",borrowedBooks);
router1.post('/addbook', addBook); //isko jrur check krna h
router1.delete('/removebook', removeBook);
router1.put('/increaseCopies',authenticateToken,authorizeAdmin,increaseCopies);
router1.put('/updateBook',authenticateToken,authorizeAdmin,updateBook);
router1.get('/getTillNow',getBorrowedTillBooks);
router1.post('/borrow-request',borrowRequest);
router1.put('/borrow-request1/:id',borrowrequesttt);
router1.get('/borrow-requests',borrowRequestss);
router1.get('/get-status',requeststatus);
export default router1;

