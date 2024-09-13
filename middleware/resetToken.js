import crypto from "crypto";

const resetToken = () => {
  // set the reset token value
  const token = crypto.randomBytes(20).toString("hex");

  // hash the token
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  // set expire time
  const expires = Date.now() + 15 * 60 * 1000;

  // store the token and expire time
  const option = {
    token,
    hashToken,
    expires,
  };
  // sent the token and its expire time
  return option;
};

export default resetToken;
