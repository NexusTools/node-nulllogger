/// <reference path="../../node_modules/@types/node/index.d.ts" />

if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (process.env.PROCESS_SEND_LOGGER == __filename)
    throw new Error("PROCESS_SEND_LOGGER is set to the ProcessSendLogger impl...");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");

import { INullLogger, LoggerLevel, ILoggerImpl } from "../def";
import { BaseLoggerImpl } from "../baseimpl";
import util = require("util");

var parentImpl: ILoggerImpl = new (require(process.env.PROCESS_SEND_LOGGER));

export = class ProcessSendLogger implements ILoggerImpl {
    filename = __filename;
    inspect0 = parentImpl.inspect0 ? parentImpl.inspect0.bind(parentImpl) : util.inspect.bind(util);
    buildScopeCache = parentImpl.buildScopeCache ? parentImpl.buildScopeCache.bind(parentImpl) : undefined;
    extendEnv(env) {
        env.PROCESS_SEND_LOGGER = process.env.PROCESS_SEND_LOGGER;
    }
    log(level: LoggerLevel, logger: INullLogger, messages: any[]) {
        if (!BaseLoggerImpl.isVerbose(level))
            return;
            
        var processedMessages: string[] = [];
        messages.forEach((message) => {
            if(typeof message == "string")
                processedMessages.push(message);
            else
                processedMessages.push(this.inspect0(message));
        });
        
        var scopeData: string[]|string;
        if(logger) {
            if(this.buildScopeCache) {
                if(!logger._scopeCache)
                    logger._scopeCache = this.buildScopeCache(logger._scopes);
                scopeData = logger._scopeCache;
            } else
                scopeData = logger._scopes;
        }

        process.send({
            "cmd": "log",
            "data": [level, scopeData, processedMessages]
        });
    }
}