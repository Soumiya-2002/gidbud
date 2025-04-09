const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../views/responseTemplates');

// 📌 Create a New Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, location, deadline, budget, lat, lng } = req.body;
        const userId = req.user.id;
        if (!title || !description || !deadline || !budget || !location) {
            return errorResponse(res, 'Missing required fields', 400);
        }

        // Validate location input
        let geoLocation;
        if (location == 'Online') {
            geoLocation = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }; // Default for online tasks
        } else if (lat && lng) {
            geoLocation = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
        } else {
            return errorResponse(res, 'Latitude and longitude are required for offline tasks', 400);
        }

        const newTask = new Task({
            user:userId,
            title,
            description,
            location: geoLocation,
            deadline,
            budget,
            attachment: req.file?.path
        });

        await newTask.save();
        return successResponse(res, 'Task created successfully', 201, newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        return errorResponse(res, 'Server error', 500);
    }
};

// 📌 List All Tasks
exports.listTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return successResponse(res, 'Tasks fetched successfully', 200, tasks);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// 📌 View Task Details
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return errorResponse(res, 'Task not found', 404);

        return successResponse(res, 'Task details fetched', 200, task);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// 📌 Accept Task
exports.acceptTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return errorResponse(res, 'Task not found', 404);

        task.status = 'accepted';
        task.assignedTo = req.user.id;
        await task.save();

        return successResponse(res, 'Task accepted successfully', 200, task);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// 📌 Mark Task as Completed
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return errorResponse(res, 'Task not found', 404);

        if (task.status !== 'accepted') return errorResponse(res, 'Task must be accepted first', 400);

        task.status = 'completed';
        await task.save();

        return successResponse(res, 'Task marked as completed', 200, task);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};

// 📌 Delete Task (Optional)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return errorResponse(res, 'Task not found', 404);

        await task.deleteOne();
        return successResponse(res, 'Task deleted successfully', 200);
    } catch (error) {
        return errorResponse(res, 'Server error', 500);
    }
};
