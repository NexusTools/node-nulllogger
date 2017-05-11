"use strict";
const clc = require("cli-color");
const util = require("util");
const _ = require("lodash");
const baseimpl_1 = require("../baseimpl");
const def_1 = require("../def");
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
                case def_1.LoggerLevel.Performance:
                case def_1.LoggerLevel.Timer:
                    color = clc.blue;
                    break;
                case def_1.LoggerLevel.Information:
                    color = _.identity;
                    break;
                case def_1.LoggerLevel.Warning:
                    color = clc.yellow;
                    break;
                case def_1.LoggerLevel.Error:
                case def_1.LoggerLevel.Fatal:
                    color = clc.red;
                    break;
                case def_1.LoggerLevel.Debugging:
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
                        if (col.length > 1)
                            col = col.substring(0, 1).toUpperCase() + col.substring(1).toLowerCase();
                        else
                            col = col.toUpperCase();
                        if (col in def_1.Color)
                            col = def_1.Color[def_1.Color[col]].toLowerCase();
                        else
                            col = undefined;
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
                    cleaned.push(_.isArray(scope) ? scope : CliColorLoggerImpl.cleanScope(scope));
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