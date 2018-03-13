"use strict";
const clc = require("cli-color");
const util = require("util");
const baseimpl_1 = require("../baseimpl");
var identity = function (obj) {
    return obj;
};
var _a;
module.exports = (_a = class CliColorLoggerImpl extends baseimpl_1.BaseLoggerImpl {
        constructor() {
            super(...arguments);
            this.disabled = process.env.NULLLOGGER_NO_COLOR;
            this.filename = __filename;
        }
        inspect0(object) {
            return util.inspect(object, { colors: true });
        }
        tag(level) {
            var color;
            switch (level) {
                case 2 /* Performance */:
                case 3 /* Timer */:
                    color = clc.blue;
                    break;
                case 4 /* Information */:
                    color = identity;
                    break;
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
        static cleanScope(scope) {
            scope = scope.toString();
            var parts = scope.match(baseimpl_1.BaseLoggerImpl.SCOPEREGEXP);
            if (parts) {
                var col = parts[1];
                if (isNaN(parts[1])) {
                    var hexParts = col.match(CliColorLoggerImpl.HEXREGEXP);
                    if (hexParts)
                        col = parseInt(hexParts[1], 16);
                    else {
                        switch (col.toLowerCase()) {
                            case "e":
                            case "grey":
                            case "black":
                                col = 0;
                                break;
                            case "r":
                            case "red":
                                col = 1;
                                break;
                            case "g":
                            case "green":
                                col = 2;
                                break;
                            case "y":
                            case "yellow":
                                col = 3;
                                break;
                            case "b":
                            case "blue":
                                col = 4;
                                break;
                            case "m":
                            case "magenta":
                                col = 5;
                                break;
                            case "c":
                            case "cyan":
                                col = 6;
                                break;
                            case "w":
                            case "white":
                                col = 7;
                                break;
                            default:
                                col = undefined;
                        }
                    }
                }
                else
                    col = col * 1;
                scope = parts[2];
                return [col, scope];
            }
            else
                return [undefined, scope];
        }
        static cleanScopes(scopes) {
            var cleaned = [];
            if (scopes)
                scopes.forEach(function (scope) {
                    cleaned.push(Array.isArray(scope) ? scope : CliColorLoggerImpl.cleanScope(scope));
                });
            return cleaned;
        }
        buildScopeCache(scopes) {
            var scopeCache = "";
            CliColorLoggerImpl.cleanScopes(scopes).forEach(function (scope) {
                scopeCache += " ";
                var _clc;
                var color = scope[0];
                if (typeof color == "string")
                    _clc = clc[color];
                else if (color)
                    _clc = clc.xterm(color);
                else {
                    scopeCache += `*${scope[1]}*`;
                    return;
                }
                scopeCache += _clc(`*${scope[1]}*`);
            });
            return scopeCache;
        }
    },
    _a.HEXREGEXP = /^0?x([a-z\d]+)$/i,
    _a);
//# sourceMappingURL=99-cli-color-logger.js.map