/// <reference path="../../node_modules/@types/node/index.d.ts" />

if (!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if (!process.send)
    throw new Error("process.send missing, are you a worker?");

import BuiltInLoggerImpl from "../BuiltInLoggerImpl";
import { LoggerLevel, ILoggerImpl } from "../Def";

export = class ProcessSendLogger implements ILoggerImpl {
    log(level: LoggerLevel, scopes: any[][], messages: any[], out: NodeJS.WritableStream) {
        var processedMessages: string[] = [];
        messages.forEach(function(message) {
            processedMessages.push(BuiltInLoggerImpl.stringForObject(message));
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