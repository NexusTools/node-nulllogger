import _ = require("lodash");
import util = require("util");

import { INullLogger, LoggerLevel, ILoggerImpl } from "./def";

export abstract class BaseLoggerImpl implements ILoggerImpl {
    public static MIN_LEVEL: LoggerLevel;
    public static MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    public static SCOPEREGEXP = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i;
    public static OUT = process.stdout;
    public static ERR = process.stderr;
    filename: string;

    static isVerbose(level: LoggerLevel) {
        return level >= BaseLoggerImpl.MIN_LEVEL;
    }
    
    extendEnv(env) {
        env.VERBOSE = 8 - BaseLoggerImpl.MIN_LEVEL;
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
        while(str.length < amnt)
            str = "0" + str;
        return str;
    }

    timestamp() {
        var now = new Date;
        return `${BaseLoggerImpl.MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${BaseLoggerImpl.pad(now.getHours())}:${BaseLoggerImpl.pad(now.getMinutes())}:${BaseLoggerImpl.pad(now.getSeconds())}.${BaseLoggerImpl.pad(now.getMilliseconds(), 3)}`;
    }
    
    tag(level: LoggerLevel) {
        return `[${this.levelStr(level)} ${this.timestamp()}]`;
    }
    
    abstract inspect0(object: any): string;
    abstract buildScopeCache(scopes: string[]): string;

    log(level: LoggerLevel, loggerOrScopeCache: INullLogger|string, message: any[]): void {
        if (!BaseLoggerImpl.isVerbose(level))
            return;
            
        var msg = this.tag(level);
        if(typeof loggerOrScopeCache == "string")
            msg += loggerOrScopeCache;
        else if(loggerOrScopeCache) {
            if(!loggerOrScopeCache._scopeCache)
                loggerOrScopeCache._scopeCache = this.buildScopeCache(loggerOrScopeCache._scopes);
            msg += loggerOrScopeCache._scopeCache;
        }
        message.forEach((object) => {
            msg += " ";
            if(typeof object == "string")
                msg += object;
            else
                msg += this.inspect0(object);
        });
        msg += "\n";
        (level >= LoggerLevel.Error ? BaseLoggerImpl.ERR : BaseLoggerImpl.OUT).write(msg);
    }
    
    setMinLevel?(level: LoggerLevel): void{
        BaseLoggerImpl.MIN_LEVEL = level;
    }
    minLevel?(): LoggerLevel{
        return BaseLoggerImpl.MIN_LEVEL;
    }
}

if (process.env.VERBOSE) {
    var verbose: any = parseFloat(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BaseLoggerImpl.MIN_LEVEL = 8 - verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if (!(verbose in LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");

        BaseLoggerImpl.MIN_LEVEL = LoggerLevel[verbose as string];
    }
} else if (process.env.NODE_ENV === "test")
    BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Debugging;
else
    BaseLoggerImpl.MIN_LEVEL = LoggerLevel.Timer;