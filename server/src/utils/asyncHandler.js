function asyncHandler(requestHandler) {
  return function (req, res, next) {
    return Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
