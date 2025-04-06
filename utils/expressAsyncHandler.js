/**
 * Returns a middleware that wraps the given async function `func`
 * and calls `next` with any error that occurs.
 *
 * @param {Function} func - async function that may throw an error
 * @returns {Function} - middleware that calls `next` with any error
 */
const asyncHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

export default asyncHandler;
