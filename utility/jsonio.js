message = (res, data, code) => {
  // This is the function that all request's body must pass through.
  // This function is not exported because if you really need to use
  // this function, you are better righting complete line below.
  res.status(code).json(data);
};
error = (res, error = "Server stopped responding", code = 500) => {
  // This is an alias of messages to support better typehinting in code editors
  // Also it improves code legibilaty.
  if (process.env.APP_MODE === "development") {
    console.error(error);
  }
  message(res, { error }, code);
};
success = (res, data, code = 200) => {
  // This is an alias of messages to support better typehinting in code editors
  // Also it improves code legibilaty.
  message(res, data, code);
};
module.exports = {
  error,
  success,
};
