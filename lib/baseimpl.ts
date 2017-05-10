import _ = require("lodash");
import util = require("util");

import { LoggerLevel, ILoggerImpl } from "./def";

export default class BaseLoggerImpl implements ILoggerImpl {
    public static _minlevel: LoggerLevel;
    public static _months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    static isVerbose(level: LoggerLevel) {
        return level >= BaseLoggerImpl._minlevel;
    }

    static levelStr(level: number): string {
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

    inspect(object: any): string {
        return util.inspect(object);
    }
    
    static pad(val: number, amnt = 2) {
        var str = val.toString();
        while(str.length < amnt)
            str = "0" + str;
        return str;
    }

    static timestamp() {
        var now = new Date;
        return `${BaseLoggerImpl._months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${BaseLoggerImpl.pad(now.getHours())}:${BaseLoggerImpl.pad(now.getMinutes())}:${BaseLoggerImpl.pad(now.getSeconds())}.${BaseLoggerImpl.pad(now.getMilliseconds(), 3)}`;
    }

    log(level: LoggerLevel, scopes: any[][], message: any[], out: NodeJS.WritableStream): void {
        throw new Error("Not implemented here");
    }

    allowAsync(): boolean {
        return true;
    }

}

if (process.env.VERBOSE) {
    var verbose: any = parseFloat(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BaseLoggerImpl._minlevel = 8 - verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if (!(verbose in LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");

        switch (LoggerLevel[verbose]) {
            default:
                BaseLoggerImpl._minlevel = LoggerLevel.Gears;
                break;
            case "Debug":
                BaseLoggerImpl._minlevel = LoggerLevel.Debug;
                break;
            case "Perf":
                BaseLoggerImpl._minlevel = LoggerLevel.Perf;
                break;
            case "Timer":
                BaseLoggerImpl._minlevel = LoggerLevel.Timer;
                break;
            case "Info":
                BaseLoggerImpl._minlevel = LoggerLevel.Info;
                break;
            case "Warn":
                BaseLoggerImpl._minlevel = LoggerLevel.Warn;
                break;
            case "Error":
                BaseLoggerImpl._minlevel = LoggerLevel.Error;
                break;
            case "Fatal":
                BaseLoggerImpl._minlevel = LoggerLevel.Fatal;
                break;
            case "Silent":
                BaseLoggerImpl._minlevel = LoggerLevel.Silent;
                break;
        }
        //BaseLoggerImpl._minlevel = LoggerLevel[verbose];
        console.log(BaseLoggerImpl._minlevel);
    }
} else if (process.env.NODE_ENV === "test")
    BaseLoggerImpl._minlevel = LoggerLevel.Debugging;
else
    BaseLoggerImpl._minlevel = LoggerLevel.Timer;