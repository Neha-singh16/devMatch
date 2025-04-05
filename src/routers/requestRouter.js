const express = require("express");
const { userAuth } = require("../config/middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendReq", userAuth, async (req, res) => {
    try {
      res.send(
        "i have sented you a request darling!!! can you please Acceeppppppt me babe??"
      );
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  });

  module.exports = requestRouter