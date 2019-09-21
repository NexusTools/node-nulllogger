import { LoggerLevel, ILoggerImpl } from "../types";
import NullLogger = require("./logger");
import util = require("util");

export interface ScopeWithColor {
  [0]: string|number;
  [1]: string;
}
export type CleanedScope = string | ScopeWithColor;

export const colorMappings = {
  "e": "black",
  "E": "black",
  "Black": "black",
  "BLACK": "black",
  "r": "red",
  "R": "red",
  "Red": "red",
  "RED": "red",
  "g": "green",
  "G": "green",
  "Green": "green",
  "GREEN": "green",
  "y": "yellow",
  "Y": "yellow",
  "Yellow": "yellow",
  "YELLOW": "yellow",
  "b": "blue",
  "B": "blue",
  "Blue": "blue",
  "BLUE": "blue",
  "m": "magenta",
  "M": "magenta",
  "Magenta": "magenta",
  "MAGENTA": "magenta",
  "c": "cyan",
  "C": "cyan",
  "Cyan": "cyan",
  "CYAN": "cyan",
  "w": "white",
  "W": "white",
  "White": "white",
  "WHITE": "white",
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const SCOPEREGEXP = /^(\w+):(.+)$/i;
export const HEXREGEXP = /^0?x([a-z\d]+)$/i;

export class ColoredText {
  readonly text: string;
  readonly color: string | number;
  constructor(text: string, color: string | number) {
    this.text = text;

    if(typeof color === "string") {
      if (!/\d+/.test(color)) {
        var hexParts = color.match(HEXREGEXP);
        if (hexParts)// Strip the 0 if one, and avoid testing names
          color = parseInt(hexParts[1], 16);
        else {
          const found = colorMappings[color];
          if(found)
            color = found;
        }
      } else {
        color = parseInt(color);
        switch(color) {
          case 0:
            color = "black";
            break;
          case 1:
            color = "red";
            break;
          case 2:
            color = "green";
            break;
          case 3:
            color = "yellow";
            break;
          case 4:
            color = "blue";
            break;
          case 5:
            color = "magenta";
            break;
          case 6:
            color = "cyan";
            break;
          case 7:
            color = "white";
            break;
        }
      }
    }
    this.color = color;
  }
  toString() {
    return this.text;
  }
}

abstract class BaseLoggerImpl implements ILoggerImpl {
  public static MIN_LEVEL: LoggerLevel;
  public static OUT = process.stdout;
  public static ERR = process.stderr;
  filename: string;

  static parseScopes(scopes: string[], scopesIsCopy = true): CleanedScope[] {
    const scopes_length = scopes.length;
    for(var i=scopes_length-1; i>=0; i--) {
      var scope = scopes[i];
      var parts: any = scope.match(SCOPEREGEXP);
      if(parts) {
        if(scopesIsCopy) {
          scopesIsCopy = false;
          scopes = scopes.slice(0);
        }
        (scopes as any)[i] = new ColoredText(parts[2], parts[1]);
      }
    }
    return scopes;
  }

  static isVerbose(level: LoggerLevel) {
    return level >= BaseLoggerImpl.MIN_LEVEL;
  }

  levelStr(level: number): string {
    switch (level) {
      case LoggerLevel.Gears:
        return "Gears";

      case LoggerLevel.Debugging:
        return "Debug";

      case LoggerLevel.Performance:
        return "Perf ";

      case LoggerLevel.Timer:
        return "Timer";

      case LoggerLevel.Information:
        return "Info ";

      case LoggerLevel.Warning:
        return "Warn ";

      case LoggerLevel.Error:
        return "Error";

      case LoggerLevel.Fatal:
        return "Fatal";

      default:
        return " ??? ";

    }
  }

  static pad(val: number, amnt = 2) {
    var str = val.toString();
    while (str.length < amnt)
      str = "0" + str;
    return str;
  }

  static formatDate(date: Date = new Date) {
    return `${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${BaseLoggerImpl.pad(date.getHours())}:${BaseLoggerImpl.pad(date.getMinutes())}:${BaseLoggerImpl.pad(date.getSeconds())}.${BaseLoggerImpl.pad(date.getMilliseconds(), 3)}`;
  }

  static setMinLevel(minLevel: string) {
    if(/\d+/.test(minLevel as string))
      BaseLoggerImpl.MIN_LEVEL = Math.max(0, Math.min(7, 7 - parseInt(minLevel as string)));
    else {
      switch((minLevel as string).toLowerCase()) {
        case "gears":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Gears;
          break;
        case "debug":
        case "debugging":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Debugging;
          break;
        default:
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Performance;
          break;
        case "timer":
        case "timers":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Timer;
          break;
        case "info":
        case "information":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Information;
          break;
        case "warn":
        case "warning":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Warning;
          break;
        case "err":
        case "error":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Error;
          break;
        case "fatal":
        case "silent":
          BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Fatal;
          break;
      }
    }
  }

  timestamp: () => string = BaseLoggerImpl.formatDate;

  tag(level: LoggerLevel) {
    return "";
  }

  inspect0(object: any) {
    if(object instanceof ColoredText)
      object = object.text;
    return util.inspect(object);
  }

  abstract buildScopeCache(scopes: NullLogger | string[] | string): string;

  log(level: LoggerLevel, loggerOrScopes: NullLogger | string[] | string, message: any[]): void {
    if (!BaseLoggerImpl.isVerbose(level))
      return;

    var msg = "";
    if(loggerOrScopes)
      msg += this.buildScopeCache(loggerOrScopes);
    message.forEach((object) => {
      if(msg)
        msg += ' ';
      if (typeof object == "string")
        msg += object;
      else
        msg += this.inspect0(object);
    });
    msg += "\n\n";
    (level >= LoggerLevel.Error ? BaseLoggerImpl.ERR : BaseLoggerImpl.OUT).write(this.tag(level) + msg);
  }
}

if (process.env.LOGGER_NO_TIMESTAMP)
  BaseLoggerImpl.prototype.tag = function(this: BaseLoggerImpl, level: LoggerLevel) {
    return `[${this.levelStr(level)}] `;
  }
else if (process.env.LOGGER_NO_LINEDOWN)
  BaseLoggerImpl.prototype.tag = function(this: BaseLoggerImpl, level: LoggerLevel) {
    return `[${this.levelStr(level)} ${this.timestamp()}] `;
  }
else
  BaseLoggerImpl.prototype.tag = function(this: BaseLoggerImpl, level: LoggerLevel) {
    return `[${this.levelStr(level)} ${this.timestamp()}]\n`;
  }

const VERBOSE = process.env.VERBOSE;
if(VERBOSE !== undefined)
  BaseLoggerImpl.setMinLevel(VERBOSE);
else
  BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Information;

export default BaseLoggerImpl;
