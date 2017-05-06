"use strict";
if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");
var BuiltInLoggerImpl_1 = require("../BuiltInLoggerImpl");
module.exports = (function () {
    function ProcessSendLogger() {
    }
    ProcessSendLogger.prototype.log = function (level, scopes, messages, out) {
        var processedMessages = [];
        messages.forEach(function (message) {
            processedMessages.push(BuiltInLoggerImpl_1.default.stringForObject(message));
        });
        process.send({
            "cmd": "log",
            "data": [level, scopes, processedMessages]
        });
    };
    ProcessSendLogger.prototype.allowAsync = function () {
        return false;
    };
    return ProcessSendLogger;
}());
//# sourceMappingURL=0-send-process.ts.js.map