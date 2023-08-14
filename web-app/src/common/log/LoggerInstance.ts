/**
 * @class
 */
export default class LoggerInstance {
  constructor(
    className: string,
    _bypass: Function,
    _debug: Function,
    _error: Function,
    _info: Function,
    _warn: Function,
  ) {
    this.className = className;
    this._bypass = _bypass;
    this._debug = _debug;
    this._error = _error;
    this._info = _info;
    this._warn = _warn;
  }

  private readonly className: string;
  private readonly _bypass: Function;
  private readonly _debug: Function;
  private readonly _error: Function;
  private readonly _info: Function;
  private readonly _warn: Function;

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  bypass(...args: any[]): void {
    this._bypass(this.className, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  debug(...args: any[]): void {
    this._debug(this.className, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  error(...args: any[]): void {
    this._error(this.className, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  info(...args: any[]): void {
    this._info(this.className, ...args);
  }

  /**
   * @param {Array<any>} args
   * @returns {void} void
   */
  warn(...args: any[]): void {
    this._warn(this.className, ...args);
  }
}
