class NotFoundError extends Error {
  constructor(message) {
    super(message);
  };
};

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
  };
};

module.exports = {
  NotFoundError,
  UnauthorizedError,
}