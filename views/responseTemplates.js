exports.successResponse = (res, message, status = 200, data = {}) => {
    return res.status(status).json({ success: true, message, data });
};

exports.errorResponse = (res, message, status = 400) => {
    return res.status(status).json({ success: false, message });
};
