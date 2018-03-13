import { ILoggerImpl, LoggerLevel } from "../../types";
import { BaseLoggerImpl } from "../baseimpl";

if (BaseLoggerImpl.MIN_LEVEL < LoggerLevel.Silent)
    throw new Error("Not enabled");

export = class SilentLoggerImpl implements ILoggerImpl {
    filename = __filename;
    extendEnv(env) {}
    log() {}
}