// Middleware for admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    return res.status(403).json({ status: false, message: 'Access denied. Admins only' });
};


export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    }

    return res.status(403).json({ status: false, message: 'Access denied. Users only' });
}