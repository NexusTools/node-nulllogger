import { BaseLoggerImpl } from "../baseimpl";
import { LoggerLevel } from "../def";

if (BaseLoggerImpl.MIN_LEVEL < LoggerLevel.Silent)
    throw new Error("Not enabled");
    
import { ILoggerImpl } from "../def";

export = class SilentLoggerImpl implements ILoggerImpl {
    filename = __filename;
    extendEnv(env) {}
    log() {}
}