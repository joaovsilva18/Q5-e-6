const { createError } = require("./errors");

/**
 * @param {unknown} value
 * @param {string} label name of the value (for error message)
 * @returns {asserts value is number} Accepts if value is integer ≥ 1
 */
function validatePositiveIntegerNumber(value, label) {
  validateIntegerNumber(value, label);
  validatePositiveNumber(value, label);
}

/**
 * @param {unknown} value
 * @param {string} label name of the value (for error message)
 * @returns {asserts value is number} Accepts if value is a positive number
 * (fractional or not)
 */
function validatePositiveNumber(value, label) {
  validateNumber(value, label);
  if (value <= 0) {
    throw createError("InvalidInputError", `${label} must be greater than 0`);
  }
}

/**
 * @param {unknown} value
 * @param {string} label name of the value (for error message)
 * @returns {asserts value is number} Accepts if value is integer
 */
function validateIntegerNumber(value, label) {
  validateNumber(value, label);
  if (!Number.isInteger(value)) {
    throw createError("InvalidInputError", `${label} must be an integer`);
  }
}

/**
 * @param {unknown} value
 * @param {string} label name of the value (for error message)
 * @returns {asserts value is number} Accepts if value is a number
 */
function validateNumber(value, label) {
  if (typeof value !== "number") {
    throw createError("InvalidInputError", `${label} must be a number`);
  }
}

/**
 * @param {unknown} value
 * @param {string} label name of the value (for error message)
 * @returns {asserts value is string} Accepts if value is a string
 */
function validateString(value, label) {
  if (typeof value !== "string") {
    throw createError("InvalidInputError", `${label} must be a string`);
  }
}

module.exports = {
  validateString,
  validateNumber,
  validateIntegerNumber,
  validatePositiveNumber,
  validatePositiveIntegerNumber,
};
