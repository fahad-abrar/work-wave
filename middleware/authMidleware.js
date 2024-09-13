import jwt from "jsonwebtoken";
import ErrorHandler from "../middleware/errorHandler.js";

const authValidator = async (req, res, next) => {
  try {
    //check if the user has access token or not
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next(new ErrorHandler("plz login to access this resource", 400));
    }

    // check if the token is valid or not
    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    // send the user through request
    req.user = decode;
    next();
  } catch (error) {
    next(new ErrorHandler("invalid token"));
  }
};
export default authValidator;
