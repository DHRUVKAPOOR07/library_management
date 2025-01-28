import jwt from 'jsonwebtoken'
// import Blacklist from '../models/Blacklist-schema.js';
const auth = async(req,res,next) => {
    const token = req.header.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'No token, authorization failed'});

    }
    try {
        const decoded = jwt.verify(token,process.env.secret_key);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({message:"Token is not valid"});
    }
}
export default auth;