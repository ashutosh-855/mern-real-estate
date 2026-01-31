import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const testing = (req, res) => {
  res.json({
    message: "Every programmer is an Author! ",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  const userId = req.params.id;

  if (req.user.id === userId) {
    try {
      const listings = await Listing.find({ userRef: userId });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can view you own listing"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!User) return next(errorHandler(404, "User Not Found"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  const { listingId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const isFavorite = user.favorites.includes(listingId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== listingId);
    } else {
      user.favorites.push(listingId);
    }

    await user.save();
    res.status(200).json({
      success: true,
      isFavorite: !isFavorite,
      message: isFavorite ? "Removed from favorites" : "Added to favorites"
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) return next(errorHandler(404, "User not found"));
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};
