import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// schema for user
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      trim: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    circleName: {
      type: String,
      trim: true,
      lowercase: true,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// pre middleware - before saving or updating its checked password is changed or not
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;

  // bcrypt is used for encrypt data through hashing
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate access token through jwt
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstNamename,
      LastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// generate referesh token through jwt
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFERESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
