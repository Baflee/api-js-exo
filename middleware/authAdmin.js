const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    if (decodeToken.isAdmin == true) {
      const _id = decodeToken._id;
      res.locals._id = _id;
      next();
    } else {
      res.json({
        message: "Vous n'avez pas assez de droit",
      });
    }
  } catch (error) {
    res.status(401).json({ error: error | "Authentification failed !" });
  }
};
