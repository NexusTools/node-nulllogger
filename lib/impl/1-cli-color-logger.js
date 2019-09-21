"use strict";
const clc = require("cli-color");
const util = require("util");
const baseimpl_1 = require("../baseimpl");
if (process.env.NULLLOGGER_NO_COLOR)
    throw new Error("Color Disabled for NullLogger");
const inspectOpts = { colors: true };
module.exports = class CliColorLoggerImpl extends baseimpl_1.default {
    constructor() {
        super(...arguments);
        this.filename = __filename;
    }
    inspect0(object) {
        if (object instanceof baseimpl_1.ColoredText) {
            var _clc;
            if (typeof object.color === "string")
                _clc = clc[object.color];
            else
                try {
                    _clc = clc.xterm(object.color);
                }
                catch (e) { }
            if (_clc)
                return _clc(object.text);
            return object.text;
        }
        return util.inspect(object, inspectOpts);
    }
    tag(level) {
        var color;
        switch (level) {
            case 2 /* Performance */:
            case 3 /* Timer */:
                color = clc.blue;
                break;
            case 4 /* Information */:
                return super.tag(level);
            case 5 /* Warning */:
                color = clc.yellow;
                break;
            case 6 /* Error */:
            case 7 /* Fatal */:
                color = clc.red;
                break;
            case 1 /* Debugging */:
                color = clc.white;
                break;
            default:
                color = clc.blackBright;
                break;
        }
        return color(super.tag(level));
    }
    buildScopeCache(loggerOrScopes) {
        var scopeCache = "";
        if (loggerOrScopes) {
            const processScope = function (scope) {
                if (!scope)
                    return;
                if (scopeCache)
                    scopeCache += " ";
                if (scope instanceof baseimpl_1.ColoredText) {
                    var _clc;
                    var color = scope.color;
                    if (typeof color === "string")
                        _clc = clc[color];
                    else
                        try {
                            _clc = clc.xterm(color);
                        }
                        catch (e) { }
                    if (_clc)
                        scopeCache += _clc(`*${scope.text}*`);
                    else
                        scopeCache += `*${scope.text}*`;
                }
                else
                    scopeCache += `*${scope}*`;
            };
            if (typeof loggerOrScopes === "string")
                processScope(loggerOrScopes);
            else if (Array.isArray(loggerOrScopes))
                baseimpl_1.default.parseScopes(loggerOrScopes).forEach(processScope);
            else {
                const eCache = loggerOrScopes['scopeCache'];
                if (!eCache || eCache[0] !== this) {
                    baseimpl_1.default.parseScopes(loggerOrScopes.scopes).forEach(processScope);
                    loggerOrScopes['scopeCache'] = [this, scopeCache];
                }
                else
                    scopeCache = eCache[1];
            }
        }
        return scopeCache;
    }
};
//# sourceMappingURL=1-cli-color-logger.js.map