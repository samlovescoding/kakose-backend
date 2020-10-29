const { error } = require("../utility/jsonio");

module.exports = (req, res, next) => {
  try {
  } catch (e) {
    error(res, e);
  }
};
