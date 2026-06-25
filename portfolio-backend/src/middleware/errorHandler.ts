import { ErrorRequestHandler } from 'express';
// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ message: err.message });
};

export default errorHandler;
