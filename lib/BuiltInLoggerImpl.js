"use strict";
var _ = require("lodash");
var Def_1 = require("./Def");
var BuiltInLoggerImpl = (function () {
    function BuiltInLoggerImpl() {
    }
    BuiltInLoggerImpl.isVerbose = function (level) {
        return level >= BuiltInLoggerImpl._minlevel;
    };
    BuiltInLoggerImpl.levelStr = function (level) {
        switch (level) {
            case Def_1.LoggerLevel.Gears:
                return "Gears";
            case Def_1.LoggerLevel.Debugging:
                return "Debug";
            case Def_1.LoggerLevel.Performance:
                return "Perf ";
            case Def_1.LoggerLevel.Timer:
                return "Timer";
            case Def_1.LoggerLevel.Information:
                return "Info ";
            case Def_1.LoggerLevel.Warning:
                return "Warn ";
            case Def_1.LoggerLevel.Error:
                return "Error";
            case Def_1.LoggerLevel.Fatal:
                return "Fatal";
            default:
                return " ??? ";
        }
    };
    BuiltInLoggerImpl.stringForObject = function (object) {
        try {
            try {
                if (object instanceof Error) {
                    if (object.stack)
                        return object.stack;
                    return "" + object;
                }
            }
            catch (e) { }
            if (_.isArray(object))
                return JSON.stringify(object);
            if (_.isObject(object)) {
                var type = object.constructor.name;
                if (type == "String")
                    throw "A string";
                var str, showName;
                if (showName = (type != "Object"))
                    str = type + "(";
                else
                    str = "";
                try {
                    if (object instanceof Date)
                        str += object.getTime();
                    else
                        switch (type) {
                            case "RegExp":
                                throw "No JSON";
                            default:
                                str += JSON.stringify(object);
                                break;
                        }
                }
                catch (e) {
                    str += object;
                }
                if (showName)
                    str += ")";
                return str;
            }
            throw "Unhandled";
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e);
            return "" + object;
        }
    };
    BuiltInLoggerImpl.elapsed = function () {
        var elapsed = Date.now() - BuiltInLoggerImpl._start;
        var tim = String(elapsed % 1000);
        while (tim.length < 3)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed / 1000)) % 60 + "." + tim;
        while (tim.length < 6)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed / 60)) % 60 + ":" + tim;
        while (tim.length < 9)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed / 60)) % 60 + ":" + tim;
        while (tim.length < 12)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed / 24)) % 24 + " " + tim;
        while (tim.length < 15)
            tim = "0" + tim;
        return tim;
    };
    BuiltInLoggerImpl.write = function (message, out) {
        out.write(BuiltInLoggerImpl.stringForObject(message));
    };
    BuiltInLoggerImpl.prototype.log = function (level, scopes, message, out) {
        throw new Error("Not implemented here");
    };
    BuiltInLoggerImpl.prototype.allowAsync = function () {
        return true;
    };
    return BuiltInLoggerImpl;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BuiltInLoggerImpl;
BuiltInLoggerImpl._start = Date.now();
if (process.env.VERBOSE) {
    var verbose = parseFloat(process.env.VERBOSE);
    if (isFinite(verbose) && !isNaN(verbose))
        BuiltInLoggerImpl._minlevel = 8 - verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if (!(verbose in Def_1.LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");
        switch (Def_1.LoggerLevel[verbose]) {
            default:
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Gears;
                break;
            case "Debug":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Debug;
                break;
            case "Perf":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Perf;
                break;
            case "Timer":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Timer;
                break;
            case "Info":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Info;
                break;
            case "Warn":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Warn;
                break;
            case "Error":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Error;
                break;
            case "Fatal":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Fatal;
                break;
            case "Silent":
                BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Silent;
                break;
        }
        console.log(BuiltInLoggerImpl._minlevel);
    }
}
else if (process.env.NODE_ENV === "test")
    BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Debugging;
else
    BuiltInLoggerImpl._minlevel = Def_1.LoggerLevel.Timer;
//# sourceMappingURL=BuiltInLoggerImpl.js.map