const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const { userAuth } = require("../config/middlewares/auth");

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

module.exports = userRouter;
