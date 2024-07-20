import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "./../models/user.model.js";

// generate access and refresh token
const generateAccesAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access tokens"
    );
  }
};

//check user is exist or not
const checkUserExistence = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  // check validation
  if ([phoneNumber].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "phone Number is required");
  }

  //chk existing user or not
  const existingUser = await User.findOne({ phoneNumber });

  if (existingUser) {
    //user exists generate tokens
    const { accessToken, refreshToken } = await generateAccesAndRefreshTokens(
      existingUser._id
    );

    const userDetails = await User.findById(existingUser._id).select(
      "-refreshToken"
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userDetails, accessToken, refreshToken },
          "user is existed in DataBase"
        )
      );
  } else {
    req.session.phoneNumber = phoneNumber; // store phoneNumber in session
    res.status(200).json(new ApiResponse(200, "User does not exist"));
  }
});

//create new user
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, gender, dateOfBirth } = req.body;

  // check validation
  if ([firstName, lastName, address].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required required");
  }

  //profile pic path
  let profilePicLocalPath = req.file.path;
  if (!profilePicLocalPath) {
    throw new ApiError(500, "profile pic is not upload");
  }
  // create new user
  const user = await User.create({
    phoneNumber: req.session.phoneNumber,
    firstName,
    lastName,
    address,
    profilePic: profilePicLocalPath,
    gender,
    dateOfBirth,
  });

  // generate refresh and access tokens
  const { accessToken, refreshToken } = await generateAccesAndRefreshTokens(
    user._id
  );

  const createUser = await User.findById(user._id).select("-refreshToken");

  if (!createUser) {
    throw new ApiError(" some thing wrong while creating user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: createUser, accessToken, refreshToken },
        "user created successfully"
      )
    );
});

export { checkUserExistence, createUser };
