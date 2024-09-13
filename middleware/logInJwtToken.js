import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (user) => {
  // mset up user payload
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  //const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  //const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_SECRET || "7d";

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    //expiresIn: REFRESH_TOKEN_EXPIRES,
    expiresIn: "7d",
  });

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    //expiresIn: ACCESS_TOKEN_EXPIRES,
    expiresIn: "7d",
  });

  // return the refresh token
  return {
    refreshToken,
    accessToken,
  };
};
export default createToken;
