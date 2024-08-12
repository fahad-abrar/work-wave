class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode
    }
}


export const errMiddleware = (err, req,res, next) =>{
    err.statusCode = err.statusCode  || 500,
    err.message = err.message || 'internal server error'

    if(err.name === 'CastError'){
        const message = `invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    if (err.code === 11000){
        const message = `duplicate ${object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    if(err.name  === 'JsonWebTokenError'){
        const message = 'invalid json web token'
        err = new ErrorHandler(message, 400)
    }

    if(err.name  === 'TokenExpiredError'){
        const message = `duplicate ${object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    return res.status(statusCode).json({
        success: false,
        message: err.message,
        err: err
    })

}

export default ErrorHandler