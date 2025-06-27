const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}

export {asyncHandler}

/*
 * This function is a middleware for handling asynchronous operations in Express.js.
 * It takes a function fn as an argument and returns a new function that handles errors.
 * If an error occurs, it sends a JSON response with the error message and status code.
 
const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
    }
    catch(error) {
        res.status(error.code || 500).json({
        success: false,
        message: error.message
    }
}

*/