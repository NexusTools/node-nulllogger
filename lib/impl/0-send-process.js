"use strict";
if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");
const util = require("util");
module.exports = class ProcessSendLogger {
    log(level, scopes, messages, out) {
        var processedMessages = [];
        messages.forEach(function (message) {
            if (typeof message == "string")
                processedMessages.push(message);
            else
                processedMessages.push(util.inspect(message));
        });
        process.send({
            "cmd": "log",
            "data": [level, scopes, processedMessages]
        });
    }
    allowAsync() {
        return false;
    }
};
//# sourceMappingURL=0-send-process.js.map