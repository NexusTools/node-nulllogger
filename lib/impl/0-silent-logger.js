"use strict";
const baseimpl_1 = require("../baseimpl");
if (baseimpl_1.default.MIN_LEVEL < 7 /* Silent */)
    throw new Error("logging level not set to silent");
module.exports = class SilentLoggerImpl {
    constructor() {
        this.filename = __filename;
    }
    extendEnv(env) { }
    log() { }
};
//# sourceMappingURL=0-silent-logger.js.map