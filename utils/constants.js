const OK = 200;
const CREATED = 201;
const REQUEST_SUCCESS = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403; // 👈 Add this line
const NOT_FOUND = 404;
const CONFLICT = 409;
const DEFAULT = 500;

module.exports = {
  OK,
  CREATED,
  REQUEST_SUCCESS,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN, // 👈 Export it too
  NOT_FOUND,
  CONFLICT,
  DEFAULT,
};
