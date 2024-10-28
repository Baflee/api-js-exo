const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretJWTKey = process.env.SECRETKEYJWT;

const isUserConnected = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, secretJWTKey);

    if (decodedToken.exp < new Date().getTime() / 1000) {
      console.error("Token expired:", decodedToken);
      res.status(401).json({ erreur: "Non autorisé" });
    } else {
      const _id = decodedToken._id;
      res.locals._id = _id;
      next();
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ erreur: "Non autorisé" });
  }
};

const isUserAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, secretJWTKey);

    if (decodedToken.exp < new Date().getTime() / 1000) {
      console.error("Token expired:", decodedToken);
      res.status(401).json({ erreur: "Non autorisé" });
    } else if (decodedToken.isAdmin) {
      const _id = decodedToken._id;
      res.locals._id = _id;
      next();
    } else {
      res.json({ message: "Vous n'avez pas les autorisations nécessaires" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ erreur: "Non autorisé" });
  }
};

const isUserIsHimselfOrAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, secretJWTKey);

    if (decodedToken.exp < new Date().getTime() / 1000) {
      console.error("Token expired:", decodedToken);
      return res.status(401).json({ erreur: "Non autorisé" });
    } else if (decodedToken.isAdmin || decodedToken._id === req.body._id) {
      const _id = decodedToken._id;
      res.locals._id = _id;
      next();
    } else {
      res.json({ message: "Vous n'avez pas les autorisations nécessaires" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ erreur: "Non autorisé" });
  }
};

module.exports = { isUserConnected, isUserAdmin, isUserIsHimselfOrAdmin };