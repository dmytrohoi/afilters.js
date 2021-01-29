/**
 * AFilters.js - Advanced Filters Library main file.
 * @module afiltersjs
 * @version 0.1.0
 * @author Dmytro Hoi <code@dmytrohoi.com>
 * @license MIT
 * @copyright Dmytro Hoi 2021
 */

// Log to console only in DEBUG mode
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'DEBUG') console.debug = () => {};

const { Approaches } = require('./utils');

const {
  NotAFunctionError,
  InvalidApproachError,
  NoFiltersError,
  NoArgumentsPassedError,
  InvalidOptionError,
} = require('./errors');

/**
 * @classdesc Filter passed arguments (to the try() method) using the added functions
 * (by the add() method) and execute a function on those arguments and
 * the result of the filters (as the last argument) (the finally() method).
 *
 * @example
 *
 * > const f = new Filter((arg1) => Boolean(arg1));
 * > f.try(1).finally((arg1, {returned}) => console.log(`Arg ${arg1} is ${returned[0]}`));
 * Arg 1 is true
 * > f.addFinal((arg1, {returned}) => console.log(`Arg ${arg1} = ${returned[0]}`));
 * > f.repeat(2);
 * Arg 2 = true
 */
class Filter {
  /**
   * All allowed Approaches can be available from Filter class.
   *
   * @example
   *
   * new Filter().setApproach(Filter.Approaches.OR)
   */
  static Approaches = Approaches;

  // Options allowed to change
  #ALLOWED_OPTIONS = ['approach', 'final'];

  //  settings
  #filters = [];

  #approach;

  #final;

  // Working variables
  #isSuccess;

  #args = [];

  #results = [];

  /**
   * Create an instance of Filter.
   * @param {Object} options - The desired options to set
   * @param {string} [String] options.approach - Pre-defined approach
   * @param {Function[]} [Array] options.filters - Pre-defined list of filter function
   * @param {Function=} options.final - Pre-defined the final preform function
   * @returns {Filter}
   */
  constructor({ filters = [], approach = 'AND', final } = {}) {
    this.approach = approach;
    if (final) this.final = final;
    if (filters.length) this.add(...filters);
  }

  /**
   * Add filter function to filters scope.
   * @param  {...Function} filters
   * @returns {Filter}
   * @throws {NotAFunctionError}
   */
  add(...filters) {
    if (!filters.every(filter => typeof filter === 'function')) throw new NotAFunctionError(filters);

    this.#filters.push(...filters);
    console.debug(`New filter added to filters array. Now it contains ${this.#filters.length} filter methods.`);
    return this;
  }

  /**
   * Try to filter passed arguments and return this filter
   *
   * NOTE: Did not saves result to object variables,
   * can't be used with finally() method.
   *
   * @param  {...Object} args
   * @returns {Filter}
   * @throws {(NoFiltersError|NoArgumentsPassedError)}
   */
  execute(...args) {
    if (!this.#filters.length) {
      throw new NoFiltersError();
    } else if (!args.length) {
      throw new NoArgumentsPassedError();
    }

    // Save args and clear filtered arguments
    let isSuccess = false;
    const results = [];
    /* eslint-disable-next-line */
    for (const filter of this.#filters) {
      const result = filter(...args);
      if (result) {
        isSuccess = true;
      } else if (this.isApproach(Approaches.AND)) {
        isSuccess = false;
        break;
      }
      results.push(result);
    }

    return { args, results, isSuccess };
  }

  /**
   * Try to filter passed arguments and return this filter (chaining)
   *
   * NOTE: Saves passed arguments to the private variable 'args', used by finally().
   * See documentation for more info.
   * @param  {...Object} args
   * @returns {Filter}
   * @throws {(NoFiltersError|NoArgumentsPassedError)}
   */
  try(...args) {
    const { results, isSuccess } = this.execute(...args);
    this.#args = args;
    this.#results = results;
    this.#isSuccess = isSuccess;
    return this;
  }

  /**
   * Perform the final function with latest args and returned values (end of chaining)
   * @param {Function} func - The final function to run with latest args and returned values
   * @param {Boolean=} [true] - Run function only if filters passed
   * @returns {any}
   * @throws {NotAFunctionError}
   */
  finally(func, onSuccess = true) {
    if (typeof func !== 'function') throw new NotAFunctionError(func);
    // Save function to make repeat
    this.addFinal(func);
    if (!this.#isSuccess && onSuccess) return console.debug('Arguments has been filtered.') || null;
    return func(...this.#args, {
      isSuccess: this.#isSuccess,
      results: this.#results,
    });
  }

  /**
   * Run filter with args and added the final function
   * @param  {...any} args
   * @returns {any}
   */
  repeat(...args) {
    if (typeof this.#final !== 'function') throw new NotAFunctionError(this.#final);

    this.try(...args);
    return this.finally(this.#final);
  }

  /**
   * Set new options for current Filter (chaining)
   * @param {Object} options - Object with allowed options
   * @returns {Filter}
   * @throws {InvalidOptionError} - Invalid option to set
   */
  setOptions(options) {
    console.debug(`Options to set: ${options}`);
    /* eslint-disable-next-line */
    for (const [key, value] of Object.entries(options)) {
      if (!this.#ALLOWED_OPTIONS.includes(key)) throw new InvalidOptionError(key, value);
      this[key] = value;
    }
    return this;
  }

  /**
   * Return the latest filtering results
   * @returns {Boolean}
   */
  get isSuccess() {
    return this.#isSuccess;
  }

  /**
   * Set the final function and return this filter (chaining)
   * @param {Function} func - The final function to start when filters will be passed.
   * @returns {Filter}
   * @throws {NotAFunctionError}
   */
  addFinal(func) {
    if (this.final !== func) this.final = func;
    return this;
  }

  /**
   * Return the final function
   * @returns {Function}
   */
  get final() {
    return this.#final;
  }

  /**
   * Set the final function and return this filter (chaining)
   * @param {Function} final - The final function to start when filters will be passed.
   * @throws {NotAFunctionError}
   */
  set final(final) {
    if (typeof final !== 'function') throw new NotAFunctionError(final);
    console.debug(`New the final function is ${final}`);
    this.#final = final;
  }

  /**
   * Set current approach by method and return this filter (chaining) (from {@link Approaches})
   * @param {String} approach
   * @returns {Filter}
   */
  setApproach(approach) {
    this.approach = approach;
    return this;
  }

  /**
   * Return copy of current filter functions
   * @returns {Function[]}
   */
  get filters() {
    return [...this.#filters];
  }

  /**
   * Return current approach name (from {@link Approaches})
   * @returns {string}
   */
  get approach() {
    return this.#approach;
  }

  /**
   * Update current approach to the desired allowed approach (from {@link Approaches})
   * @throws {InvalidApproachError}
   */
  set approach(approach) {
    if (!(approach in Approaches)) throw new InvalidApproachError(approach);
    console.debug(`New approach is ${approach}`);
    this.#approach = approach;
  }

  /**
   * Check that current approach is the desired approach
   * @param {String} value - The desired approach
   * @returns {Boolean}
   */
  isApproach(value) {
    return this.#approach === value;
  }
}

module.exports = Filter;
