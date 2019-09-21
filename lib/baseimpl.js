"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.colorMappings = {
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
exports.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.SCOPEREGEXP = /^(\w+):(.+)$/i;
exports.HEXREGEXP = /^0?x([a-z\d]+)$/i;
class ColoredText {
    constructor(text, color) {
        this.text = text;
        if (typeof color === "string") {
            if (!/\d+/.test(color)) {
                var hexParts = color.match(exports.HEXREGEXP);
                if (hexParts) // Strip the 0 if one, and avoid testing names
                    color = parseInt(hexParts[1], 16);
                else {
                    const found = exports.colorMappings[color];
                    if (found)
                        color = found;
                }
            }
            else {
                color = parseInt(color);
                switch (color) {
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
exports.ColoredText = ColoredText;
class BaseLoggerImpl {
    constructor() {
        this.timestamp = BaseLoggerImpl.formatDate;
    }
    static parseScopes(scopes, scopesIsCopy = true) {
        const scopes_length = scopes.length;
        for (var i = scopes_length - 1; i >= 0; i--) {
            var scope = scopes[i];
            var parts = scope.match(exports.SCOPEREGEXP);
            if (parts) {
                if (scopesIsCopy) {
                    scopesIsCopy = false;
                    scopes = scopes.slice(0);
                }
                scopes[i] = new ColoredText(parts[2], parts[1]);
            }
        }
        return scopes;
    }
    static isVerbose(level) {
        return level >= BaseLoggerImpl.MIN_LEVEL;
    }
    levelStr(level) {
        switch (level) {
            case 0 /* Gears */:
                return "Gears";
            case 1 /* Debugging */:
                return "Debug";
            case 2 /* Performance */:
                return "Perf ";
            case 3 /* Timer */:
                return "Timer";
            case 4 /* Information */:
                return "Info ";
            case 5 /* Warning */:
                return "Warn ";
            case 6 /* Error */:
                return "Error";
            case 7 /* Fatal */:
                return "Fatal";
            default:
                return " ??? ";
        }
    }
    static pad(val, amnt = 2) {
        var str = val.toString();
        while (str.length < amnt)
            str = "0" + str;
        return str;
    }
    static formatDate(date = new Date) {
        return `${exports.MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${BaseLoggerImpl.pad(date.getHours())}:${BaseLoggerImpl.pad(date.getMinutes())}:${BaseLoggerImpl.pad(date.getSeconds())}.${BaseLoggerImpl.pad(date.getMilliseconds(), 3)}`;
    }
    static setMinLevel(minLevel) {
        if (/\d+/.test(minLevel))
            BaseLoggerImpl.MIN_LEVEL = Math.max(0, Math.min(7, 7 - parseInt(minLevel)));
        else {
            switch (minLevel.toLowerCase()) {
                case "gears":
                    BaseLoggerImpl.MIN_LEVEL = 0 /* Gears */;
                    break;
                case "debug":
                case "debugging":
                    BaseLoggerImpl.MIN_LEVEL = 1 /* Debugging */;
                    break;
                default:
                    BaseLoggerImpl.MIN_LEVEL = 2 /* Performance */;
                    break;
                case "timer":
                case "timers":
                    BaseLoggerImpl.MIN_LEVEL = 3 /* Timer */;
                    break;
                case "info":
                case "information":
                    BaseLoggerImpl.MIN_LEVEL = 4 /* Information */;
                    break;
                case "warn":
                case "warning":
                    BaseLoggerImpl.MIN_LEVEL = 5 /* Warning */;
                    break;
                case "err":
                case "error":
                    BaseLoggerImpl.MIN_LEVEL = 6 /* Error */;
                    break;
                case "fatal":
                case "silent":
                    BaseLoggerImpl.MIN_LEVEL = 7 /* Fatal */;
                    break;
            }
        }
    }
    tag(level) {
        return "";
    }
    inspect0(object) {
        if (object instanceof ColoredText)
            object = object.text;
        return util.inspect(object);
    }
    log(level, loggerOrScopes, message) {
        if (!BaseLoggerImpl.isVerbose(level))
            return;
        var msg = "";
        if (loggerOrScopes)
            msg += this.buildScopeCache(loggerOrScopes);
        message.forEach((object) => {
            if (msg)
                msg += ' ';
            if (typeof object == "string")
                msg += object;
            else
                msg += this.inspect0(object);
        });
        msg += "\n\n";
        (level >= 6 /* Error */ ? BaseLoggerImpl.ERR : BaseLoggerImpl.OUT).write(this.tag(level) + msg);
    }
}
BaseLoggerImpl.OUT = process.stdout;
BaseLoggerImpl.ERR = process.stderr;
if (process.env.LOGGER_NO_TIMESTAMP)
    BaseLoggerImpl.prototype.tag = function (level) {
        return `[${this.levelStr(level)}] `;
    };
else if (process.env.LOGGER_NO_LINEDOWN)
    BaseLoggerImpl.prototype.tag = function (level) {
        return `[${this.levelStr(level)} ${this.timestamp()}] `;
    };
else
    BaseLoggerImpl.prototype.tag = function (level) {
        return `[${this.levelStr(level)} ${this.timestamp()}]\n`;
    };
const VERBOSE = process.env.VERBOSE;
if (VERBOSE !== undefined)
    BaseLoggerImpl.setMinLevel(VERBOSE);
else
    BaseLoggerImpl.MIN_LEVEL = 4 /* Information */;
exports.default = BaseLoggerImpl;
//# sourceMappingURL=baseimpl.js.map