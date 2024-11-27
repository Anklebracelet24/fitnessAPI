const bcrypt = require("bcrypt");
const User = require("../models/User");

const auth = require("../auth");

module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be atleast 8 characters" });
  } else {
    let newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((user) =>
        res.status(201).send({ message: "Registered Successfully" })
      )
      .catch((err) => {
        console.error("Error in saving: ", err);
        return res.status(500).send({ error: "Error in save" });
      });
  }
};

module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (result == null) {
          return res.status(404).send({ error: "No Email Found" });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password
          );
          if (isPasswordCorrect) {
            return res
              .status(200)
              .send({ access: auth.createAccessToken(result) });
          } else {
            return res
              .status(401)
              .send({ message: "Email and password do not match" });
          }
        }
      })
      .catch((err) => err);
  } else {
    return res.status(400).send(false);
  }
};

module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        // if the user has invalid token, send a message 'invalid signature'.
        return res.status(403).send({ message: "invalid signature" });
      } else {
        const userDetails = {
          _id: user._id,
          email: user.email,
          __v: user.__v,
        };

        return res.status(200).send({
          user: userDetails,
        });
      }
    })
    .catch((err) => {
      console.error("Error : ", err);
      return res.status(500).send({ error: "Invalid user details" });
    });
};
