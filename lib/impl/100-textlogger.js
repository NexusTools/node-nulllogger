"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BuiltInLoggerImpl_1 = require("../BuiltInLoggerImpl");
module.exports = (function (_super) {
    __extends(TextLoggerImpl, _super);
    function TextLoggerImpl() {
        return _super.apply(this, arguments) || this;
    }
    TextLoggerImpl.prototype.log = function (level, scopes, messages, out) {
        if (!BuiltInLoggerImpl_1.default.isVerbose(level))
            return;
        out.write("[");
        out.write(BuiltInLoggerImpl_1.default.levelStr(level));
        out.write(" ");
        out.write(BuiltInLoggerImpl_1.default.elapsed());
        out.write("]");
        scopes.forEach(function (scope) {
            out.write(" *");
            out.write(scope[1]);
            out.write("*");
        });
        messages.forEach(function (message) {
            out.write(" ");
            out.write(BuiltInLoggerImpl_1.default.stringForObject(message));
        });
        out.write("\n");
    };
    return TextLoggerImpl;
}(BuiltInLoggerImpl_1.default));
//# sourceMappingURL=100-textlogger.js.map