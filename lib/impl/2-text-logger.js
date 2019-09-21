"use strict";
const baseimpl_1 = require("../baseimpl");
module.exports = class TextLoggerImpl extends baseimpl_1.default {
    constructor() {
        super(...arguments);
        this.filename = __filename;
    }
    buildScopeCache(loggerOrScopes) {
        var scopeCache = "";
        if (loggerOrScopes) {
            const processScope = function (scope) {
                if (!scope)
                    return;
                if (scopeCache)
                    scopeCache += " ";
                if (Array.isArray(scope)) {
                    scopeCache += `*${scope[1]}*`;
                }
                else
                    scopeCache += `*${scope}*`;
            };
            if (typeof loggerOrScopes === "string")
                processScope(loggerOrScopes);
            else if (Array.isArray(loggerOrScopes))
                baseimpl_1.default.parseScopes(loggerOrScopes).forEach(processScope);
            else {
                const eCache = loggerOrScopes['scopeCache'];
                if (!eCache || eCache[0] !== this) {
                    baseimpl_1.default.parseScopes(loggerOrScopes.scopes).forEach(processScope);
                    loggerOrScopes['scopeCache'] = [this, scopeCache];
                }
                else
                    scopeCache = eCache[1];
            }
        }
        return scopeCache;
    }
};
//# sourceMappingURL=2-text-logger.js.map