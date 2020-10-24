const configuration = require("../models/configuration");
const { error } = require("../utility/jsonio");
const isDevelopment = require("../utility/isDevelopment");

module.exports = async (req, res, next) => {
  try {
    configurations = await configuration.find();
    req.config = configurations.reduce((accumulator, item) => {
      accumulator[item.key] = item.value;
      return accumulator;
    }, {});
    if (isDevelopment()) {
      const requiredKeys = [
        "tee_time_length",
        "tee_time_max_bookings",
        "club_opening_time",
        "club_closing_time",
      ];
      requiredKeys.forEach((key) => {
        let didFindKey = false;
        if (req.config[key] === undefined || req.config[key] === null) {
          console.log(
            "Required configuration key " +
              key +
              " is not configured or is null. Please fix it as soon as possible."
          );
        }
      });
    }
    next();
  } catch (e) {
    error(e);
  }
};
