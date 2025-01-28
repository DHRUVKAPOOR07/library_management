import express from 'express';
import { createUser, deleteUser, editUser, getusers, loginUser } from '../controllers/usercontroller.js';
import auth1 from '../middleware/auth1.js';
import { logoutUser } from '../controllers/loggingoutcontroller.js';
import { getBooks } from '../controllers/bookcontroller.js';
import authenticateToken from '../middleware/authentication.js';
import authorizeAdmin from '../middleware/authorization.js';

const router = express.Router();
router.delete("/delete",deleteUser);
router.get('/getbooks',getBooks);
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout',authenticateToken,logoutUser);
router.post('/edit/:userId',authenticateToken,editUser);
router.get('/getusers',getusers);
export default router;
