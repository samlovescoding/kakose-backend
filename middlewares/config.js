const configuration = require("../models/configuration");
const { error } = require("../utility/jsonio");

module.exports = async (req, res, next) => {
  try {
    configurations = await configuration.find();
    req.config = configurations.reduce((accumulator, item) => {
      accumulator[item.key] = item.value;
      return accumulator;
    }, {});
    next();
  } catch (e) {
    error(e);
  }
};
