"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseLoggerImpl {
    static isVerbose(level) {
        return level >= BaseLoggerImpl.MIN_LEVEL;
    }
    extendEnv(env) {
        env.VERBOSE = 8 - BaseLoggerImpl.MIN_LEVEL;
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
    timestamp() {
        var now = new Date;
        return `${BaseLoggerImpl.MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()} ${BaseLoggerImpl.pad(now.getHours())}:${BaseLoggerImpl.pad(now.getMinutes())}:${BaseLoggerImpl.pad(now.getSeconds())}.${BaseLoggerImpl.pad(now.getMilliseconds(), 3)}`;
    }
    tag(level) {
        return "";
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
        (level >= 6 /* Error */ ? BaseLoggerImpl.ERR : BaseLoggerImpl.OUT).write(msg);
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
if (process.env.LOGGER_NO_TIMESTAMP)
    BaseLoggerImpl.prototype.tag = function (level) {
        return `[${this.levelStr(level)}]`;
    };
else
    BaseLoggerImpl.prototype.tag = function (level) {
        return `[${this.levelStr(level)} ${this.timestamp()}]`;
    };
if (process.env.VERBOSE) {
    var verbose = parseInt(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BaseLoggerImpl.MIN_LEVEL = 8 - verbose;
}
else if (process.env.NODE_ENV === "test")
    BaseLoggerImpl.MIN_LEVEL = 1 /* Debugging */;
else
    BaseLoggerImpl.MIN_LEVEL = 3 /* Timer */;
//# sourceMappingURL=baseimpl.js.map