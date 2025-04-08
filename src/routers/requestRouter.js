const express = require("express");
const { userAuth } = require("../config/middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //check if the status is valid or not!!
      const allowed_status = ["interested", "ignored"];
      if (!allowed_status.includes(status)) {
        return res.status(400).send("Invalid status!!");
      }

      //check If the user already exist or not!!
      const existingrequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingrequest) {
        return res
          .status(400)
          .send("This User Connection request already exists!!");
      }

      //check if the toUser should exist in the database or not!!
      const isUser = await User.findById(toUserId);
      if (!isUser) {
        return res.status(400).send("This user doesn't exist!!");
      }

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " your request is sent to!! " + isUser.firstName,
        data: data,
      });
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.user._id;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid Status!!");
      }

      const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!request) {
        return res
          .status(404)
          .send(
            `No connection request found with ID "${requestId}" assigned to your account (User ID: "${loggedInUserId}").`
          );
      }

      request.status = status;
      const data = await request.save();

      res.json({
        message: `Your request is ${status}!!`,
        data: data,
      });
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  }
);

module.exports = requestRouter;
