"use strict";
const baseimpl_1 = require("../baseimpl");
const def_1 = require("../def");
if (baseimpl_1.BaseLoggerImpl.MIN_LEVEL < def_1.LoggerLevel.Silent)
    throw new Error("Not enabled");
module.exports = class SilentLoggerImpl {
    constructor() {
        this.filename = __filename;
    }
    extendEnv(env) { }
    log() { }
};
//# sourceMappingURL=98-silent-logger.js.map