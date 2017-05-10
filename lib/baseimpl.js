"use strict";
const util = require("util");
const def_1 = require("./def");
class BaseLoggerImpl {
    static isVerbose(level) {
        return level >= BaseLoggerImpl._minlevel;
    }
    static levelStr(level) {
        switch (level) {
            case def_1.LoggerLevel.Gears:
                return "Gears";
            case def_1.LoggerLevel.Debugging:
                return "Debug";
            case def_1.LoggerLevel.Performance:
                return "Perf ";
            case def_1.LoggerLevel.Timer:
                return "Timer";
            case def_1.LoggerLevel.Information:
                return "Info ";
            case def_1.LoggerLevel.Warning:
                return "Warn ";
            case def_1.LoggerLevel.Error:
                return "Error";
            case def_1.LoggerLevel.Fatal:
                return "Fatal";
            default:
                return " ??? ";
        }
    }
    inspect(object) {
        return util.inspect(object);
    }
    static pad(val, amnt = 2) {
        var str = val.toString();
        while (str.length < amnt)
            str = "0" + str;
        return str;
    }
    static timestamp() {
        var now = new Date;
        return `${BaseLoggerImpl._months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${BaseLoggerImpl.pad(now.getHours())}:${BaseLoggerImpl.pad(now.getMinutes())}:${BaseLoggerImpl.pad(now.getSeconds())}.${BaseLoggerImpl.pad(now.getMilliseconds(), 3)}`;
    }
    log(level, scopes, message, out) {
        throw new Error("Not implemented here");
    }
    allowAsync() {
        return true;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseLoggerImpl;
BaseLoggerImpl._months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
if (process.env.VERBOSE) {
    var verbose = parseFloat(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BaseLoggerImpl._minlevel = 8 - verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if (!(verbose in def_1.LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");
        switch (def_1.LoggerLevel[verbose]) {
            default:
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Gears;
                break;
            case "Debug":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Debug;
                break;
            case "Perf":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Perf;
                break;
            case "Timer":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Timer;
                break;
            case "Info":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Info;
                break;
            case "Warn":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Warn;
                break;
            case "Error":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Error;
                break;
            case "Fatal":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Fatal;
                break;
            case "Silent":
                BaseLoggerImpl._minlevel = def_1.LoggerLevel.Silent;
                break;
        }
        console.log(BaseLoggerImpl._minlevel);
    }
}
else if (process.env.NODE_ENV === "test")
    BaseLoggerImpl._minlevel = def_1.LoggerLevel.Debugging;
else
    BaseLoggerImpl._minlevel = def_1.LoggerLevel.Timer;
//# sourceMappingURL=baseimpl.js.map