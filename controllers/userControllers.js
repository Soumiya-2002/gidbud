const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('../views/responseTemplates');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return errorResponse(res, 'User already exists', 400);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        return successResponse(res, 'User registered successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return errorResponse(res, 'Invalid credentials', 400);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse(res, 'Invalid credentials', 400);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return successResponse(res, 'Login successful', 200, { token, userId: user._id });
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// Logout User
exports.logout = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return errorResponse(res, 'No token provided', 400);

        // Decode token to get expiry time
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return errorResponse(res, 'Invalid token', 400);

        // Store the token in the blacklist database with expiry time
        await Blacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

        return successResponse(res, 'User logged out successfully', 200);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return errorResponse(res, 'User not found', 404);

        return successResponse(res, 'User profile fetched', 200, user);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};
