import { ILoggerImpl } from "../types";

export = class TestLoggerImpl implements ILoggerImpl {
    filename = __filename;
    extendEnv(env) {}
    log() {}
}