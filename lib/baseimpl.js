"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_1 = require("./def");
class BaseLoggerImpl {
    static isVerbose(level) {
        return level >= BaseLoggerImpl.MIN_LEVEL;
    }
    extendEnv(env) {
        env.VERBOSE = 8 - BaseLoggerImpl.MIN_LEVEL;
    }
    levelStr(level) {
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
    static pad(val, amnt = 2) {
        var str = val.toString();
        while (str.length < amnt)
            str = "0" + str;
        return str;
    }
    timestamp() {
        var now = new Date;
        return `${BaseLoggerImpl.MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${BaseLoggerImpl.pad(now.getHours())}:${BaseLoggerImpl.pad(now.getMinutes())}:${BaseLoggerImpl.pad(now.getSeconds())}.${BaseLoggerImpl.pad(now.getMilliseconds(), 3)}`;
    }
    tag(level) {
        return `[${this.levelStr(level)} ${this.timestamp()}]`;
    }
    log(level, loggerOrScopeCache, message) {
        if (!BaseLoggerImpl.isVerbose(level))
            return;
        var msg = this.tag(level);
        if (typeof loggerOrScopeCache == "string")
            msg += loggerOrScopeCache;
        else if (loggerOrScopeCache) {
            if (!loggerOrScopeCache._scopeCache)
                loggerOrScopeCache._scopeCache = this.buildScopeCache(loggerOrScopeCache._scopes);
            msg += loggerOrScopeCache._scopeCache;
        }
        message.forEach((object) => {
            msg += " ";
            if (typeof object == "string")
                msg += object;
            else
                msg += this.inspect0(object);
        });
        msg += "\n";
        (level >= def_1.LoggerLevel.Error ? BaseLoggerImpl.ERR : BaseLoggerImpl.OUT).write(msg);
    }
    setMinLevel(level) {
        BaseLoggerImpl.MIN_LEVEL = level;
    }
    minLevel() {
        return BaseLoggerImpl.MIN_LEVEL;
    }
}
BaseLoggerImpl.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
BaseLoggerImpl.SCOPEREGEXP = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i;
BaseLoggerImpl.OUT = process.stdout;
BaseLoggerImpl.ERR = process.stderr;
exports.BaseLoggerImpl = BaseLoggerImpl;
if (process.env.VERBOSE) {
    var verbose = parseFloat(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BaseLoggerImpl.MIN_LEVEL = 8 - verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if (!(verbose in def_1.LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");
        BaseLoggerImpl.MIN_LEVEL = def_1.LoggerLevel[verbose];
    }
}
else if (process.env.NODE_ENV === "test")
    BaseLoggerImpl.MIN_LEVEL = def_1.LoggerLevel.Debugging;
else
    BaseLoggerImpl.MIN_LEVEL = def_1.LoggerLevel.Timer;
//# sourceMappingURL=baseimpl.js.map