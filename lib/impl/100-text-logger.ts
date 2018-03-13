import { INullLogger, LoggerLevel, ILoggerImpl } from "../../types";
import { BaseLoggerImpl } from "../baseimpl";
import util = require("util");

export = class TextLoggerImpl extends BaseLoggerImpl {
    filename = __filename;
    static cleanScope(scope: string): string {
        scope = scope.toString();
        var parts = scope.match(BaseLoggerImpl.SCOPEREGEXP);
        if (parts)
            return parts[2];
        else
            return scope;
    }
    static cleanScopes(scopes: string[]): string[] {
        var cleaned: string[] = [];
        if(scopes)
            scopes.forEach(function(scope) {
                cleaned.push(Array.isArray(scope) ? scope : TextLoggerImpl.cleanScope(scope));
            });
        return cleaned;
    }
    inspect0(object: any) {
        return util.inspect(object);
    }
    buildScopeCache(scopes: string[]) {
        var scopeCache = "";
        TextLoggerImpl.cleanScopes(scopes).forEach((scope) => {
            scopeCache += ` *${scope}*`;
        });
        return scopeCache;
    }
}