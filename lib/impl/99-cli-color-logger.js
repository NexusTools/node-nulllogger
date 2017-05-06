"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var clc = require("cli-color");
var BuiltInLoggerImpl_1 = require("../BuiltInLoggerImpl");
var Def_1 = require("../Def");
module.exports = (function (_super) {
    __extends(CliColorLoggerImpl, _super);
    function CliColorLoggerImpl() {
        return _super.apply(this, arguments) || this;
    }
    CliColorLoggerImpl.prototype.log = function (level, scopes, messages, out) {
        if (!BuiltInLoggerImpl_1.default.isVerbose(level))
            return;
        var color, strColor = function () {
            var text = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                text[_i - 0] = arguments[_i];
            }
            return text[0];
        };
        switch (level) {
            case Def_1.LoggerLevel.Performance:
            case Def_1.LoggerLevel.Timer:
                color = clc.blue;
                break;
            case Def_1.LoggerLevel.Information:
                color = strColor;
                break;
            case Def_1.LoggerLevel.Warning:
                color = clc.yellow;
                break;
            case Def_1.LoggerLevel.Error:
            case Def_1.LoggerLevel.Fatal:
                color = clc.red;
                break;
            case Def_1.LoggerLevel.Debugging:
                color = clc.white;
                strColor = color;
                break;
            default:
                color = clc.blackBright;
                strColor = color;
                break;
        }
        var pre = "[" + BuiltInLoggerImpl_1.default.levelStr(level) + " " + BuiltInLoggerImpl_1.default.elapsed() + "]";
        out.write(color(pre));
        scopes.forEach(function (scope) {
            out.write(" ");
            var color;
            if (scope[0] in Def_1.Color) {
                color = Def_1.Color[scope[0]].toLowerCase();
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
            out.write(strColor(BuiltInLoggerImpl_1.default.stringForObject(message)));
        });
        out.write("\n");
    };
    return CliColorLoggerImpl;
}(BuiltInLoggerImpl_1.default));
//# sourceMappingURL=99-cli-color-logger.js.map