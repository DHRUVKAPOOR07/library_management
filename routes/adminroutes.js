import express from 'express';
// import Admin from '../models/admin-schema.js';
import { createAdmin,loginAdmin } from '../controllers/admincontroller.js';
const routes2 = express.Router();

routes2.post('/loginadmin',loginAdmin);
routes2.post('/createadmin',createAdmin);
export default routes2;