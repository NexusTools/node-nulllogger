import BaseLoggerImpl from "../baseimpl";
import { LoggerLevel } from "../def";
import util = require("util");

export = class TextLoggerImpl extends BaseLoggerImpl {
    log(level: LoggerLevel, scopes: any[][], messages: any[], out: NodeJS.WritableStream) {
        if (!BaseLoggerImpl.isVerbose(level))
            return;

        out.write("[");
        out.write(BaseLoggerImpl.levelStr(level));
        out.write(" ");
        out.write(BaseLoggerImpl.timestamp());
        out.write("]");

        scopes.forEach(function(scope) {
            out.write(" *");
            out.write(scope[1]);
            out.write("*");
        });

        messages.forEach(function(message) {
            out.write(" ");
            if(typeof message == "string")
                out.write(message);
            else
                out.write(util.inspect(message));
        });

        out.write("\n");
    }
}