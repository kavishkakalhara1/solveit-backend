import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/users/User.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters")); 
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.email) {
    if (req.body.email.length < 7 || req.body.email.length > 20) {
      return next(
        errorHandler(400, "Email must be between 7 and 20 characters")
      );
    }
    if (req.body.email.includes(" ")) {
      return next(errorHandler(400, "Email cannot contain spaces"));
    }
    if (req.body.email !== req.body.email.toLowerCase()) {
      return next(errorHandler(400, "Email must be lowercase"));
    }
    if (!req.body.email.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Email can only contain letters and numbers")
      );
    }
  }
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          internationalmobilenumber: req.body.internationalmobilenumber,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          district: req.body.district,
          city: req.body.city,
          address: req.body.address,
          fixedtelephonenumber: req.body.fixedtelephonenumber,
          occupation: req.body.occupation,
          professionalqualifications: req.body.professionalqualifications,
          otherqualifications: req.body.otherqualifications,
          workplacename: req.body.workplacename,
          workplaceaddress: req.body.workplaceaddress,
          postgraduateachievements: req.body.postgraduateachievements,
          areyoucoporatemember: req.body.areyoucoporatemember,
          othercoporatememberships: req.body.othercoporatememberships,
          residinginsrilanka: req.body.residinginsrilanka,
          country: req.body.country,
          batch: req.body.batch,
          specialization: req.body.specialization,
          popularname: req.body.popularname,
          passedoutyear: req.body.passedoutyear,
          universityregistrationnumber: req.body.universityregistrationnumber,
          profileImage: req.body.profileImage,
          
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const changeIsMemberStatus = async (req, res, next) => {
  const { userId } = req.params;
  const { isMember: newStatus } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isMember: newStatus },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
