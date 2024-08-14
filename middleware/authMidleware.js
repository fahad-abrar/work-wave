import jwt from 'jsonwebtoken'


const authValidator =async(req,res, next)=>{
    // check if request headers have an authorization field
    const authorization = req.headers.authorization

    if(!authorization){
        return res.status(400).json({
            success:false,
            message:'token is not found'
        })
    }
    // extract the jwt token from the authorization headers
    const token = authorization.split(" ")[1]

    if(!token){
        return res.status(400).json({
            success:false,
            message:'unauthorized'
        })
    }
    try {
        // verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // attach user information to the request object
        req.user = decoded
        next()

    } catch (err){
        console.log(err)
        return res.status(400).json({
            success:false,
            message:'invalid token'
        })
        
    }
}
export default authValidator