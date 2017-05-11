"use strict";
const baseimpl_1 = require("../baseimpl");
const util = require("util");
module.exports = class TextLoggerImpl extends baseimpl_1.BaseLoggerImpl {
    constructor() {
        super(...arguments);
        this.filename = __filename;
    }
    static cleanScope(scope) {
        scope = scope.toString();
        var parts = scope.match(baseimpl_1.BaseLoggerImpl.SCOPEREGEXP);
        if (parts)
            return parts[2];
        else
            return scope;
    }
    static cleanScopes(scopes) {
        var cleaned = [];
        if (scopes)
            scopes.forEach(function (scope) {
                cleaned.push(Array.isArray(scope) ? scope : TextLoggerImpl.cleanScope(scope));
            });
        return cleaned;
    }
    inspect0(object) {
        return util.inspect(object);
    }
    buildScopeCache(scopes) {
        var scopeCache = "";
        TextLoggerImpl.cleanScopes(scopes).forEach((scope) => {
            scopeCache += ` *${scope}*`;
        });
        return scopeCache;
    }
};
//# sourceMappingURL=100-text-logger.js.map