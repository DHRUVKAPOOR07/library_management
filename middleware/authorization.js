import Admin from '../models/admin-schema.js';
const authorizeAdmin = async(req, res, next) => {
    try {
        const isAdmin = await Admin.findOne({ username:req.user.username }); 

        if (!isAdmin) {
            return res.status(403).json({ status: 'fail', message: 'User is not an admin' });
        }
        next();
    } catch (error) {
        console.error("Error in admin authorization", error);
        return res.status(500).json({ status: 'fail', message: 'Error checking admin status', error: error.message });
    }
};
export default authorizeAdmin;
