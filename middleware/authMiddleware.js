const jwt = require('jsonwebtoken');
const { errorResponse } = require('../views/responseTemplates');
const Blacklist = require('../models/Blacklist');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return errorResponse(res, 'Access denied', 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid token', 400);
    }
};

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return errorResponse(res, 'Access denied', 401);

        // Check if token is blacklisted
        const blacklisted = await Blacklist.findOne({ token });
        if (blacklisted) return errorResponse(res, 'Session expired, please login again', 401);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid token', 400);
    }
};