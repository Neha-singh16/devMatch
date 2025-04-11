const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const { userAuth } = require("../config/middlewares/auth");
const { User } = require("../models/user");

const USER_DATA = ["firstName", "lastName"];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);

    if (!connectionRequest) {
      return res.status(400).send("No connection request found!!");
    }

    res.json({
      message: "Connection request received!!",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    }).populate("fromUserId", USER_DATA);

    if (!connectionRequest) {
      return res.status(400).send("No connection found!!");
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: "Coonection Found",
      data: data,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit > 50 ? (limit = 50) : limit;
    
    let skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    })
      .select("firstName lastName status")
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const hiddenUsersToFeed = new Set();
    connectionRequest.forEach((req) => {
      hiddenUsersToFeed.add(req.fromUserId._id.toString());
      hiddenUsersToFeed.add(req.toUserId._id.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hiddenUsersToFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = userRouter;
