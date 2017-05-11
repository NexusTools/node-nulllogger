import { ILoggerImpl } from "../lib/def";

export = class TestLoggerImpl implements ILoggerImpl {
    filename = __filename;
    extendEnv(env) {}
    log() {}
}