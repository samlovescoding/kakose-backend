const jwt = require("jsonwebtoken");
const { error } = require("../utility/jsonio");

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined) {
      error(
        res,
        {
          message: "You are not authorized.",
        },
        401
      );
      return;
    }
    let authorization = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(authorization, process.env.JWT_SECRET);
    next();
  } catch (e) {
    error(res, e, 401);
  }
};
