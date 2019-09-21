import { default as BaseLoggerImpl, CleanedScope } from "../baseimpl";
import NullLogger = require("../logger");

export = class TextLoggerImpl extends BaseLoggerImpl {
  filename = __filename;
  buildScopeCache(loggerOrScopes: NullLogger | string[] | string) {
    var scopeCache = "";
    if(loggerOrScopes) {
      const processScope = function(scope: CleanedScope) {
        if(!scope)
          return;

        if(scopeCache)
          scopeCache += " ";

        if(Array.isArray(scope)) {
          scopeCache += `*${scope[1]}*`;
        } else
          scopeCache += `*${scope}*`;
      };
      if(typeof loggerOrScopes === "string")
        processScope(loggerOrScopes);
      else if(Array.isArray(loggerOrScopes))
        BaseLoggerImpl.parseScopes(loggerOrScopes).forEach(processScope);
      else {
        const eCache = loggerOrScopes['scopeCache'];
        if(!eCache || eCache[0] !== this) {
          BaseLoggerImpl.parseScopes(loggerOrScopes.scopes).forEach(processScope);
          loggerOrScopes['scopeCache'] = [this, scopeCache];
        } else
          scopeCache = eCache[1];
      }
    }
    return scopeCache;
  }
}
