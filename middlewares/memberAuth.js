const jwt = require("jsonwebtoken");
const { error } = require("../utility/jsonio");

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization === undefined) {
      error(res, { message: "You are not authorized." }, 401);
      return;
    }
    let { authorization, club } = req.headers;

    req.member = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.club = club;

    next();
  } catch (e) {
    error(res, e, 401);
  }
};
