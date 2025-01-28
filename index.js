import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import makeconnection from './connection/connection.js';
import bookRoutes from './routes/bookRoutes.js';
import adminroutes from './routes/adminroutes.js';  
// import { getBooks } from './controllers/bookcontroller.js';
// import { addBook } from './controllers/bookcontroller.js';
dotenv.config();
const port = 8000;
const app = express();
makeconnection(process.env.DB_username,process.env.DB_password);
app.use(cors());
app.get('/',(req,res)=>{
    res.send("Hello World");
});
app.use(express.json({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/users', borrowRoutes);
app.use('/api/users',bookRoutes);
app.use('/api/users',adminroutes);
// app.use('/api/users',adminroutes);
app.listen(port,()=>{
    console.log("Server is running on the port ",port);
})