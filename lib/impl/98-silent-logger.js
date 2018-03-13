"use strict";
const types_1 = require("../../types");
const baseimpl_1 = require("../baseimpl");
if (baseimpl_1.BaseLoggerImpl.MIN_LEVEL < types_1.LoggerLevel.Silent)
    throw new Error("Not enabled");
module.exports = class SilentLoggerImpl {
    constructor() {
        this.filename = __filename;
    }
    extendEnv(env) { }
    log() { }
};
//# sourceMappingURL=98-silent-logger.js.map