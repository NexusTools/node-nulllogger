import clc = require("cli-color");

import BuiltInLoggerImpl from "../BuiltInLoggerImpl";
import { Color, LoggerLevel } from "../Def";

export = class CliColorLoggerImpl extends BuiltInLoggerImpl {
    log(level: LoggerLevel, scopes: Array<any[]>, messages: any[], out: NodeJS.WritableStream) {
        if (!BuiltInLoggerImpl.isVerbose(level))
            return;

        var color: Function, strColor: Function = function(...text: any[]): string { return text[0]; };
        switch (level) {
            case LoggerLevel.Performance:
            case LoggerLevel.Timer:
                color = clc.blue;
                break;

            case LoggerLevel.Information:
                color = strColor;
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
                strColor = color;
                break;

            default:
                color = clc.blackBright;
                strColor = color;
                break;

        }

        var pre = "[" + BuiltInLoggerImpl.levelStr(level) + " " + BuiltInLoggerImpl.elapsed() + "]";
        out.write(color(pre));

        scopes.forEach(function(scope) {
            out.write(" ");

            var color: any;
            if (scope[0] in Color) {
                color = Color[scope[0]].toLowerCase();
                if (color == "black")
                    color = clc.blackBright;
                else if (color in clc)
                    color = clc[color];
            } else {
                if (isNaN(scope[0]))
                    color = clc.xterm(parseInt(scope[0].substring(1), 16));
                else
                    color = clc.xterm(scope[0] * 1);
            }

            out.write((color || clc.magentaBright)("*" + scope[1] + "*"));
        });
        messages.forEach(function(message) {
            out.write(" ");
            out.write(strColor(BuiltInLoggerImpl.stringForObject(message)));
        });
        out.write("\n");
    }
}