import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    niche: {
      firstNiche: {
        type: String,
        required: false,
      },
      secondNiche: {
        type: String,
        required: false,
      },
      thirdNiche: {
        type: String,
        required: false,
      },
    },
    coverLetter: {
      type: String,
      required: false,
    },

    resume: {
      public_id: String,
      url: String,
    },
    image: {
      public_id: String,
      url: String,
    },
    workAs: {
      type: String,
      enum: ["admin", "jobSeeker", "employe"],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
