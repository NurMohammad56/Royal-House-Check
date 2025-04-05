// Middleware for admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({ status: false, message: 'Access denied. Admins only' });
};


export const isClient = (req, res, next) => {
    if (req.user && req.user.role === 'client') {
        return next();
    }

    return res.status(403).json({ status: false, message: 'Access denied. Clients only' });
}

export const isStaff = (req, res, next) => {
    if (req.user && req.user.role === 'staff') {
        return next();
    }

    return res.status(403).json({ status: false, message: 'Access denied. Staffs only' });
}