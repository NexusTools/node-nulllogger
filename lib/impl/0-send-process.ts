/// <reference path="../../node_modules/@types/node/index.d.ts" />

if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");

import BaseLoggerImpl from "../baseimpl";
import { LoggerLevel, ILoggerImpl } from "../def";
import util = require("util");

export = class ProcessSendLogger implements ILoggerImpl {
    log(level: LoggerLevel, scopes: any[][], messages: any[], out: NodeJS.WritableStream) {
        var processedMessages: string[] = [];
        messages.forEach(function(message) {
            if(typeof message == "string")
                processedMessages.push(message);
            else
                processedMessages.push(util.inspect(message));
        });

        process.send({
            "cmd": "log",
            "data": [level, scopes, processedMessages]
        });
    }

    allowAsync(): boolean {
        return false;
    }
}