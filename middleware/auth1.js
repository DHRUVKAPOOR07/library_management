import jwt from 'jsonwebtoken';
// import Admin from '../models/admin-schema.js';
import Blacklist from '../models/Blacklist-schema.js';
// import auth from './auth.js';

export const auth1 = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: 'fail',
                message: 'Authorization header is missing'
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'No token provided'
            });
        }
        const blackListedToken = await Blacklist.findOne({ token });
        if (blackListedToken) {
            return res.status(401).json({
                status: 'fail',
                message: 'Token has been expired'
            });
        }
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error: ", error);
        return res.status(401).json({
            status: 'fail',
            message: 'Authentication error',
            error: error.message
        });
    }
};
const adminonly = async(req,res,next) =>{
    if(req.user&&req.user.role==='admin'){
        next();
    }
    else{
        return res.status(403).json({
            status:'fail',
            message:'Access denied, Admins only!'
        });
    }

}
export default adminonly;