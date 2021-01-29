/**
 * Errors for AFilters.js - Advanced Filters Library.
 * @module afiltersjs/utils
 * @version 0.1.0
 * @author Dmytro Hoi <code@dmytrohoi.com>
 * @license MIT
 * @copyright Dmytro Hoi 2021
 */

/**
 * Throws Error indicates that argument is not a Function
 */
class NotAFunctionError extends Error {
  constructor(argument) {
    let type;
    if (Array.isArray(argument)) {
      type = argument
        .map(filter => typeof filter)
        .filter(v => v !== 'function')
        .join(' or ');
    } else {
      type = typeof argument;
    }
    super(`Argument must be Function, not ${type}`);
    this.name = 'NotAFunctionError';
  }
}

/**
 * Throws Error indicates that invalid approach passed
 */
class InvalidApproachError extends Error {
  constructor(argument) {
    super(`Not allowed approach: ${argument}`);
    this.name = 'InvalidApproachError';
  }
}

/**
 * Throws Error indicates that no filters added
 */
class NoFiltersError extends Error {
  constructor() {
    super('No filters found');
    this.name = 'NoFiltersError';
  }
}

/**
 * Throws Error indicates that no filters added
 */
class NoArgumentsPassedError extends Error {
  constructor() {
    super('No arguments to filter');
    this.name = 'NoArgumentsPassedError';
  }
}

/**
 * Throws Error indicates that invalid option passed
 */
class InvalidOptionError extends Error {
  constructor(key, value) {
    super(`Invalid option with name '${key}' and value '${value}'`);
    this.name = 'InvalidOptionError';
  }
}

module.exports = {
  NotAFunctionError,
  InvalidApproachError,
  NoFiltersError,
  NoArgumentsPassedError,
  InvalidOptionError,
};
