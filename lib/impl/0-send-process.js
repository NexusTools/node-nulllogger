"use strict";
/// <reference types="node" />
if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (process.env.PROCESS_SEND_LOGGER == __filename)
    throw new Error("PROCESS_SEND_LOGGER is set to the ProcessSendLogger impl...");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");
const baseimpl_1 = require("../baseimpl");
const util = require("util");
var parentImpl = new (require(process.env.PROCESS_SEND_LOGGER));
module.exports = class ProcessSendLogger {
    constructor() {
        this.filename = __filename;
        this.inspect0 = parentImpl.inspect0 ? parentImpl.inspect0.bind(parentImpl) : util.inspect.bind(util);
        this.buildScopeCache = parentImpl.buildScopeCache ? parentImpl.buildScopeCache.bind(parentImpl) : undefined;
    }
    extendEnv(env) {
        env.PROCESS_SEND_LOGGER = process.env.PROCESS_SEND_LOGGER;
    }
    log(level, logger, messages) {
        if (!baseimpl_1.BaseLoggerImpl.isVerbose(level))
            return;
        var processedMessages = [];
        messages.forEach((message) => {
            if (typeof message == "string")
                processedMessages.push(message);
            else
                processedMessages.push(this.inspect0(message));
        });
        var scopeData;
        if (logger) {
            if (this.buildScopeCache) {
                if (!logger._scopeCache)
                    logger._scopeCache = this.buildScopeCache(logger._scopes);
                scopeData = logger._scopeCache;
            }
            else
                scopeData = logger._scopes;
        }
        process.send({
            "cmd": "log",
            "data": [level, scopeData, processedMessages]
        });
    }
};
//# sourceMappingURL=0-send-process.js.map