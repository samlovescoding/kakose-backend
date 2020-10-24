message = (res, data, code) => {
  // This is the function that all request's body must pass through.
  // This function is not exported because if you really need to use
  // this function, you are better righting complete line below.
  return res.status(code).json(data);
};

error = (res, error = "Server stopped responding", code = 500) => {
  // This is an alias of messages to support better typehinting in code editors
  // Also it improves code legibilaty.
  if (process.env.APP_MODE === "development") {
    console.error(error);
  }

  // For base javascript errors.
  if (error instanceof Error) {
    error = {
      name: error.name,
      message: error.message,
    };
    code = error.code || 500;
  }
  // For an array of errors
  if (Array.isArray(error)) {
    return message(res, { errors: error, length: error.length }, 500);
  }

  return message(res, { error }, code);
};

// This function is to be used with then(serveSuccess(res))
// It will serve the response.
serveSuccess = (res) => {
  return function (data) {
    success(res, data);
  };
};

// This function is to be used with promise error catching
// catch(caughtError(res)). It will serve the error over 500.
caughtError = (res) => {
  return (err) => {
    error(res, err);
  };
};

success = (res, data, code = 200) => {
  // This is an alias of messages to support better typehinting in code editors
  // Also it improves code legibilaty.
  return message(res, data, code);
};
module.exports = {
  error,
  success,
  caughtError,
  serveSuccess,
};
