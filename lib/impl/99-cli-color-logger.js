"use strict";
const clc = require("cli-color");
const util = require("util");
const baseimpl_1 = require("../baseimpl");
const def_1 = require("../def");
module.exports = class CliColorLoggerImpl extends baseimpl_1.default {
    log(level, scopes, messages, out) {
        if (!baseimpl_1.default.isVerbose(level))
            return;
        var color, strColor = function (...text) { return text[0]; };
        switch (level) {
            case def_1.LoggerLevel.Performance:
            case def_1.LoggerLevel.Timer:
                color = clc.blue;
                break;
            case def_1.LoggerLevel.Information:
                color = strColor;
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
                strColor = color;
                break;
            default:
                color = clc.blackBright;
                strColor = color;
                break;
        }
        var pre = "[" + baseimpl_1.default.levelStr(level) + " " + baseimpl_1.default.timestamp() + "]";
        out.write(color(pre));
        scopes.forEach(function (scope) {
            out.write(" ");
            var color;
            if (scope[0] in def_1.Color) {
                color = def_1.Color[scope[0]].toLowerCase();
                if (color == "black")
                    color = clc.blackBright;
                else if (color in clc)
                    color = clc[color];
            }
            else {
                if (isNaN(scope[0]))
                    color = clc.xterm(parseInt(scope[0].substring(1), 16));
                else
                    color = clc.xterm(scope[0] * 1);
            }
            out.write((color || clc.magentaBright)("*" + scope[1] + "*"));
        });
        messages.forEach(function (message) {
            out.write(" ");
            if (typeof message == "string")
                out.write(message);
            else
                out.write(strColor(util.inspect(message, { colors: true })));
        });
        out.write("\n");
    }
};
//# sourceMappingURL=99-cli-color-logger.js.map