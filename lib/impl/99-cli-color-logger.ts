import clc = require("cli-color");
import util = require("util");

import { BaseLoggerImpl } from "../baseimpl";
import { Color, LoggerLevel } from "../def";

var identity = function(obj) {
    return obj;
}

export = class CliColorLoggerImpl extends BaseLoggerImpl {
    private static HEXREGEXP = /^0?x([a-z\d]+)$/i;
    disabled = process.env.NULLLOGGER_NO_COLOR;
    filename = __filename;
    inspect0(object: any) {
        return util.inspect(object, { colors: true });
    }
    tag(level: LoggerLevel) {
        var color: Function;
        switch (level) {
            case LoggerLevel.Performance:
            case LoggerLevel.Timer:
                color = clc.blue;
                break;

            case LoggerLevel.Information:
                color = identity;
                break;

            case LoggerLevel.Warning:
                color = clc.yellow;
                break;

            case LoggerLevel.Error:
            case LoggerLevel.Fatal:
                color = clc.red;
                break;

            case LoggerLevel.Debugging:
                color = clc.white;
                break;

            default:
                color = clc.blackBright;
                break;
        }
        
        return color(super.tag(level));
    }
    static cleanScope(scope: string): any[] {
        scope = scope.toString();
        var parts: any = scope.match(BaseLoggerImpl.SCOPEREGEXP);
        if (parts) {
            var col: any = parts[1];
            if (isNaN(parts[1])) {
                var hexParts = col.match(CliColorLoggerImpl.HEXREGEXP);
                if (hexParts) // Strip the 0 if one, and avoid testing names
                    col = parseInt(hexParts[1], 16);
                else {
                    if (col.length > 1)
                        col = col.substring(0, 1).toUpperCase() + col.substring(1).toLowerCase();
                    else
                        col = col.toUpperCase();

                    if (col in Color)
                        col = Color[Color[col]].toLowerCase();
                    else
                        col = undefined;
                }
            } else
                col = col*1;

            scope = parts[2];
            return [col, scope];
        } else
            return [undefined, scope];
    }
    static cleanScopes(scopes?: string[]): any[][] {
        var cleaned: any[][] = [];
        if(scopes)
            scopes.forEach(function(scope) {
                cleaned.push(Array.isArray(scope) ? scope as any : CliColorLoggerImpl.cleanScope(scope));
            });
        return cleaned;
    }
    buildScopeCache(scopes: string[]) {
        var scopeCache = "";
        CliColorLoggerImpl.cleanScopes(scopes).forEach(function(scope) {
            scopeCache += " ";

            var _clc: Function;
            var color: any = scope[0];
            if (typeof color == "string")
                _clc = clc[color];
            else if(color)
                _clc = clc.xterm(color);
            else {
                scopeCache += `*${scope[1]}*`;
                return;
            }

            scopeCache += _clc(`*${scope[1]}*`);
        });
        return scopeCache;
    }
}