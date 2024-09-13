import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import createToken from "../middleware/logInJwtToken.js";
import ErrorHandler from "../middleware/errorHandler.js";

class authUser {
  static async getUser(req, res, next) {
    try {
      // check if the user is exist or not
      const userData = await User.find();
      if (!userData) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // send the  response
      return res.status(200).json({
        success: true,
        message: " user get successfully",
        userData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async getUserbyId(req, res, next) {
    try {
      const { id } = req.params;

      // check if the user is exist or not
      const findUser = await User.findById(id);
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: " user retrieved successfully",
        findUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.massage, 500));
    }
  }
  static async registerUser(req, res, next) {
    try {
      const {
        name,
        email,
        password,
        phone,
        address,
        firstNiche,
        secondNiche,
        thirdNiche,
        coverLetter,
        workAs,
      } = req.body;

      //check all the field are provided or not
      if (!name || !email || !password || !phone || !address || !workAs) {
        return next(new ErrorHandler("all fields are required", 404));
      }

      // check if the job seeker provide the niche or not
      if (workAs === "jobSeeker") {
        if (!firstNiche) {
          return next(new ErrorHandler("first niche is required", 404));
        }
      }

      // Check if the user already exists
      const existUser = await User.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("user is already is already exist", 404));
      }

      // generating hash password
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      // Prepare the user data
      const userData = {
        name,
        email,
        password: hashPass,
        phone,
        address,
        niche: {
          firstNiche,
          secondNiche,
          thirdNiche,
        },
        coverLetter,
        workAs,
      };

      // Create the new user
      const newUser = await User.create(userData);

      // Check if an image is provided

      if (req.files && req.files.image) {
        newUser.image.public_id = req.files.image[0].filename;
        newUser.image.url = req.files.image[0].path;
        await newUser.save();
      }
      // check if resume is provided
      if (req.files && req.files.resume) {
        newUser.resume.public_id = req.files.resume[0].filename;
        newUser.resume.url = req.files.resume[0].path;
        await newUser.save();
      }

      console.log(newUser);
      return res.status(200).json({
        success: true,
        message: "User registered successfully",
        newUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async logInUser(req, res, next) {
    try {
      const { email, password } = req.body;
      // check if all the required field are provided or not
      if (!email || !password) {
        return next(
          new ErrorHandler("email and password both are required", 404)
        );
      }

      // find the user if the user is exist
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // check given password is correct or not
      const isMatch = bcrypt.compareSync(password, findUser.password);
      if (!isMatch) {
        return next(new ErrorHandler("password is not match", 404));
      }

      // create access token and refresh token
      const { accessToken, refreshToken } = createToken(findUser);
      const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES);
      const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES);

      // option for cookies
      const accessTokenOption = {
        expires: new Date(Date.now() + accessTokenExpires * 1000 * 100000),
        httpOnly: true,
      };
      const refreshTokenOption = {
        expires: new Date(Date.now() + refreshTokenExpires * 1000 * 100000),
        httpOnly: true,
      };

      // send the cookie response
      res.cookie("accessToken", accessToken, accessTokenOption);
      res.cookie("refreshToken", refreshToken, refreshTokenOption);

      // return the respone
      return res.status(201).json({
        success: true,
        message: "user is logged in",
        user: findUser,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }
  static async logOutUser(req, res, next) {
    try {
      // access the id from the auth user
      const { id } = req.user;

      // find the auth user
      const user = await User.findById(id);
      if (!user) {
        return next(new ErrorHandler("invalid credential", 404));
      }

      // set the cookie option
      const option = {
        expires: new Date(Date.now() + 10),
        httpOnly: true,
      };

      // clear the cookie and send the response
      res.cookie("accessToken", null, option);
      res.cookie("refreshToken", null, option);

      // return the response
      return res.status(200).json({
        success: true,
        message: " user is logout",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstNiche, secondNiche, thirdNiche, ...rest } = req.body;

      // retrieve the authorized user
      const authUser = await User.findById(req.user.id);

      // update the user data
      const findUser = await User.findById(id);

      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // check if the user is authorized to update or not
      if (authUser.id !== findUser.id) {
        return next(
          new ErrorHandler("auth user only can update the user profile", 404)
        );
      }

      // check if workas a jobseeker then first niche is provided or not
      if (findUser.workAs === "jobSeeker" && !firstNiche) {
        return next(new ErrorHandler("job niche is required", 404));
      }

      // Check if an image is provided
      if (req.files && req.files.image) {
        findUser.image.public_id = req.files.image[0].filename;
        findUser.image.url = req.files.image[0].path;
      }

      // check if resume is provided
      if (req.files && req.files.resume) {
        findUser.resume.public_id = req.files.resume[0].filename;
        findUser.resume.url = req.files.resume[0].path;
      }

      // prepare the data for update
      const updateData = {
        ...rest,
        niche: {
          firstNiche,
          secondNiche,
          thirdNiche,
        },
      };

      // update the user profile
      const updateUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      // send the response
      return res.status(200).json({
        success: true,
        message: " user updated successfully",
        updateUser: updateUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // check if the user is exist or not
      const findUser = await User.findById(id);
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 500));
      }

      // delete the user finding by the id
      const deleteUser = await User.findByIdAndDelete(id);

      // send the response
      return res.status(200).json({
        success: true,
        message: " user deleted successfully",
        findUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  static async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { password, newPassword, confirmPassword } = req.body;

      //check all the fields are provided
      if (!password || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("all fields are required", 404));
      }
      // check if the user is exist or not
      const findUser = await User.findById(id);
      if (!findUser) {
        return next(new ErrorHandler("user is not found", 404));
      }

      // check the current password is match
      const isMatch = bcrypt.compareSync(password, findUser.password);

      if (!isMatch) {
        return next(new ErrorHandler("password is not match", 404));
      }

      // check if the new pass and confirm pass are same
      if (newPassword !== confirmPassword) {
        return next(
          new ErrorHandler(
            "new password and confirm password mush be match",
            404
          )
        );
      }

      // hash the new pass
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(newPassword, salt);

      //update the new password and save
      findUser.password = hashPass;
      await findUser.save();

      return res.status(200).json({
        success: true,
        message: "password updated successfully",
        findUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

export default authUser;
