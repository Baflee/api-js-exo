const jwt = require("jsonwebtoken");

const User = require("../models/user_model");

const isUserConnected = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRETKEYJWT);

    const _id = decodedToken._id;
    res.locals._id = _id;
    next();
  } catch (error) {
    res.status(401).json({ erreur: error });
  }
};

const isUserAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRETKEYJWT);

    console.log(decodedToken.isAdmin);

    if (decodedToken.isAdmin) {
      const _id = decodedToken._id;
      res.locals._id = _id;
      next();
    } else {
      res.json({ message: "Vous n'avez pas les autorisations necessaires" });
    }
  } catch (error) {
    res.status(401).json({ erreur: error });
  }
};

const isUserIsHimselfOrAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRETKEYJWT);

    console.log(decodedToken.isAdmin);

    if (decodedToken.isAdmin || decodedToken._id === req.body._id) {
      const _id = decodedToken._id;
      res.locals._id = _id;
      next();
    } else {
      res.json({ message: "Vous n'avez pas les autorisations necessaires" });
    }
  } catch (error) {
    res.status(401).json({ erreur: error });
  }
};

module.exports = { isUserConnected, isUserAdmin, isUserIsHimselfOrAdmin };
