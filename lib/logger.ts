/// <reference types="node" />

import { LoggerLevel, ILoggerImpl } from "../types";
import { default as _BaseLoggerImpl, ColoredText as ColoredText_ } from "./baseimpl";

var BaseLoggerImpl: typeof _BaseLoggerImpl;
var ColoredText: typeof ColoredText_;

export = class NullLogger {
  static active: ILoggerImpl;

  private scopeCache: any;
  readonly scopes: string[];
  constructor(...scopes: string[]) {
    this.scopes = scopes;
  }

  static makeColored(text: string, color: string | number) {
    return new (ColoredText || (ColoredText = require("./baseimpl").ColoredText))(text, color);
  }

  static makeLoggerImpl() {
    if (process.env.LOGGER_IMPL) {
      var plugin = require(process.env.LOGGER_IMPL);
      if(plugin.default)
        return new (plugin.default);
      return new plugin();
    }

    var plugins: any[] = [
      "0-silent-logger",
      "1-cli-color-logger",
      "2-text-logger"
    ];

    var $break = new Object();
    var _impl: ILoggerImpl;
    try {
      plugins.forEach(function(plugin) {
        try {
          plugin = require("./impl/" + plugin);
          _impl = new plugin();
        } catch (e) {
          return;
        }
        throw $break;
      });
    } catch (e) {
      if (e !== $break)
        throw e;
    }
    return _impl;
  }

  /**
   * Log data to the specified implementation.
   *
   * @param level The logging level to use
   * @param loggerOrScopes The logger, scope(s)
   * @param messages The message data to log
   * @param impl The logger implementation
   */
  static log(level: LoggerLevel, loggerOrScopes: NullLogger | string[] | string, messages: any[], impl: ILoggerImpl = NullLogger.active) {
    return (impl || NullLogger.active || (NullLogger.active = NullLogger.makeLoggerImpl())).log(level, loggerOrScopes, messages);
  }

  /**
   * Log with gears level
   *
   * @param messages The message data to log
   */
  static gears(...messages: any[]) {
    NullLogger.log(LoggerLevel.Gears, undefined, messages);
  }

  /**
   * Log with performance level
   *
   * @param messages The message data to log
   */
  static performance(...messages: any[]) {
    NullLogger.log(LoggerLevel.Performance, undefined, messages);
  }

  /**
   * Log with performance level
   *
   * @param messages The message data to log
   */
  static perf(...messages: any[]) {
    NullLogger.log(LoggerLevel.Performance, undefined, messages);
  }

  /**
   * Log with debugging level
   *
   * @param messages The message data to log
   */
  static debugging(...messages: any[]) {
    NullLogger.log(LoggerLevel.Debugging, undefined, messages);
  }

  /**
   * Log with debugging level
   *
   * @param messages The message data to log
   */
  static debug(...messages: any[]) {
    NullLogger.log(LoggerLevel.Debugging, undefined, messages);
  }

  /**
   * Log with information level
   *
   * @param messages The message data to log
   */
  static info(...messages: any[]) {
    NullLogger.log(LoggerLevel.Information, undefined, messages);
  }

  /**
   * Log with information level
   *
   * @param messages The message data to log
   */
  static information(...messages: any[]) {
    NullLogger.log(LoggerLevel.Information, undefined, messages);
  }

  /**
   * Log with warning level
   *
   * @param messages The message data to log
   */
  static warn(...messages: any[]) {
    NullLogger.log(LoggerLevel.Warning, undefined, messages);
  }

  /**
   * Log with warning level
   *
   * @param messages The message data to log
   */
  static warning(...messages: any[]) {
    NullLogger.log(LoggerLevel.Warning, undefined, messages);
  }

  /**
   * Log with error level
   *
   * @param messages The message data to log
   */
  static error(...messages: any[]) {
    NullLogger.log(LoggerLevel.Fatal, undefined, messages);
  }

  /**
   * Log with fatal level, then exit with code 1
   *
   * @param messages The message data to log
   */
  static fatal(...messages: any[]) {
    NullLogger.log(LoggerLevel.Fatal, undefined, messages);
    process.exit(1);
  }

  /**
   * Change the minimum logging level
   *
   * @param level The new minimum logging level to use
   */
  static setMinLevel(level: LoggerLevel | string) {
    if(!BaseLoggerImpl)
      BaseLoggerImpl = require("./baseimpl").default;
    if(typeof level === "string")
      BaseLoggerImpl.setMinLevel(level);
    else
      BaseLoggerImpl.MIN_LEVEL = level;
  }
  /**
   * Return the minimum logging level
   */
  static minLevel(): LoggerLevel {
    if(!BaseLoggerImpl)
      BaseLoggerImpl = require("./baseimpl").default;
    return BaseLoggerImpl.MIN_LEVEL;
  }

  /**
   * Return the filename of the logging implementation, when available
   */
  static impl() {
    return NullLogger.active.filename;
  }

  /**
   * Log with gears level
   *
   * @param messages The message data to log
   */
  gears(...messages: any[]) {
    NullLogger.log(LoggerLevel.Gears, this, messages);
    return this;
  }

  /**
   * Measure the duration a function takes to execuse.
   * If the function returns a promise, waits for the promise to complete.
   *
   * @param name The name of the timer
   * @param impl The function implementation to measure
   */
  timer(name: string, impl: (logger: NullLogger) => void | Promise<any>) {
    var logger = this.extend(name);
    NullLogger.log(LoggerLevel.Timer, logger, ["Running function", name]);
    var start = +new Date;
    const promise = impl(logger);
    if(promise instanceof Promise) {
      promise.catch(function(err) {
        NullLogger.log(LoggerLevel.Error, logger, ["Function", name, "errored:", err]);
      });
      promise.finally(function() {
        NullLogger.log(LoggerLevel.Timer, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
      });
    } else
      NullLogger.log(LoggerLevel.Timer, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
    return this;
  }

  /**
   * Measure the duration a function takes to execuse, in a inherently asynchronious way.
   *
   * @param name The name of the timer
   * @param impl The function implementation to measure
   */
  timerAsync(name: string, impl: (logger: NullLogger, cb: (err?: Error) => void) => void) {
    var logger = this.extend(name);
    NullLogger.log(LoggerLevel.Timer, logger, ["Starting function", name]);
    var start = +new Date;
    impl(logger, function(err?: Error) {
      if(err instanceof Error)
        NullLogger.log(LoggerLevel.Error, logger, ["Function", name, "errored:", err]);
      NullLogger.log(LoggerLevel.Timer, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
    });
    return this;
  }

  /**
   * Log with performance level
   *
   * @param messages The message data to log
   */
  performance(...messages: any[]) {
    NullLogger.log(LoggerLevel.Performance, this, messages);
    return this;
  }

  /**
   * Log with performance level
   *
   * @param messages The message data to log
   */
  perf(...messages: any[]) {
    NullLogger.log(LoggerLevel.Performance, this, messages);
    return this;
  }

  /**
   * Log with debugging level
   *
   * @param messages The message data to log
   */
  debugging(...messages: any[]) {
    NullLogger.log(LoggerLevel.Debugging, this, messages);
    return this;
  }

  /**
   * Log with debugging level
   *
   * @param messages The message data to log
   */
  debug(...messages: any[]) {
    NullLogger.log(LoggerLevel.Debugging, this, messages);
    return this;
  }

  /**
   * Log with information level
   *
   * @param messages The message data to log
   */
  info(...messages: any[]) {
    NullLogger.log(LoggerLevel.Information, this, messages);
    return this;
  }

  /**
   * Log with information level
   *
   * @param messages The message data to log
   */
  information(...messages: any[]) {
    NullLogger.log(LoggerLevel.Information, this, messages);
    return this;
  }

  /**
   * Log with warning level
   *
   * @param messages The message data to log
   */
  warn(...messages: any[]) {
    NullLogger.log(LoggerLevel.Warning, this, messages);
    return this;
  }

  /**
   * Log with warning level
   *
   * @param messages The message data to log
   */
  warning(...messages: any[]) {
    NullLogger.log(LoggerLevel.Warning, this, messages);
    return this;
  }

  /**
   * Log with error level
   *
   * @param messages The message data to log
   */
  error(...messages: any[]) {
    NullLogger.log(LoggerLevel.Error, this, messages);
    return this;
  }

  /**
   * Log with error level, and exit with code 1 after
   *
   * @param messages The message data to log
   */
  fatal(...messages: any[]) {
    NullLogger.log(LoggerLevel.Fatal, this, messages);
    process.exit(1);
  }

  /**
   * Return a new NullLogger that extends this one
   *
   * @param messages The message data to log
   */
  extend(...scopes: string[]): NullLogger {
    var merged = this.scopes.slice(0);
    merged.push.apply(merged, scopes);

    var logger = new NullLogger();
    (logger as any).scopes = merged;
    return logger;
  }

  /**
   * Execute within a group, using a new temporary NullLogger
   *
   * @param messages The message data to log
   */
  group(name: string, impl: (logger: NullLogger) => void) {
    impl(this.extend(name));
    return this;
  }

  /**
   * Update a specific scope at a specific index
   *
   * @param messages The message data to log
   */
  updateScopeName(scope: string, index = -1) {
    if (index < 0)
      this.scopes[this.scopes.length + index] = scope;
    else
      this.scopes[index] = scope;
    delete this.scopeCache;
    return this;
  }

  /**
   * Return a specific scope at a specific index
   *
   * @param messages The message data to log
   */
  scopeName(index: number = -1) {
    if (index < 0)
      return this.scopes[this.scopes.length + index];
    else
      return this.scopes[index];
  }

  static useWithDeathHandler(scriptToRun: string, ondeath?: (signal?, err?) => void, implementation?: () => void) {
    try {
      require('death')(function(signal, err) {
        if(ondeath)
          ondeath(signal, err);
      });
    } catch(e) {

    }
  }

  readonly isDeathRun = false;

}
