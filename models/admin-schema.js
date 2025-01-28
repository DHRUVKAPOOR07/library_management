import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        default:'admin'
    },
    createdAt:{ 
        type:Date,
        default:Date.now()
    }
});
const getRole = () =>{
    return "admin";
}
const Admin = new mongoose.model('admins',adminSchema);
export default Admin;