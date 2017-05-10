"use strict";
const baseimpl_1 = require("../baseimpl");
const util = require("util");
module.exports = class TextLoggerImpl extends baseimpl_1.default {
    log(level, scopes, messages, out) {
        if (!baseimpl_1.default.isVerbose(level))
            return;
        out.write("[");
        out.write(baseimpl_1.default.levelStr(level));
        out.write(" ");
        out.write(baseimpl_1.default.timestamp());
        out.write("]");
        scopes.forEach(function (scope) {
            out.write(" *");
            out.write(scope[1]);
            out.write("*");
        });
        messages.forEach(function (message) {
            out.write(" ");
            if (typeof message == "string")
                out.write(message);
            else
                out.write(util.inspect(message));
        });
        out.write("\n");
    }
};
//# sourceMappingURL=100-textlogger.js.map