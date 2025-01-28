import mongoose, { mongo } from "mongoose";
const purchaseSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'books'
    },
    borrowedDate:{
        type:Date,
        default:Date.now(),
        required:true
    },
    returnDate:{
        type:Date,
    },
    dueDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['borrowed','returned'],
        default:'borrowed'
    }
});
const Purchase = mongoose.model('purchases',purchaseSchema);
export default Purchase;