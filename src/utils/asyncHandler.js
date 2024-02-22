const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch(err => next(err))
    }
}

export { asyncHandler }





// try catch syntax
// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         await func(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message,
//         })
//     }
// }



// asyncHandler is a higher order function which takes normal function as an argument and executes them in async-await, try-catch or promise syntax 