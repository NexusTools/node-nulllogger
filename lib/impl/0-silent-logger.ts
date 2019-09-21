import { ILoggerImpl, LoggerLevel } from "../../types";
import { default as BaseLoggerImpl } from "../baseimpl";

if (BaseLoggerImpl.MIN_LEVEL < LoggerLevel.Silent)
  throw new Error("logging level not set to silent");

export = class SilentLoggerImpl implements ILoggerImpl {
  filename = __filename;
  extendEnv(env) { }
  log() { }
}
