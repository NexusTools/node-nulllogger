import clc = require("cli-color");
import util = require("util");

import { default as BaseLoggerImpl, ColoredText, CleanedScope } from "../baseimpl";
import { LoggerLevel } from "../../types";
import NullLogger = require("../logger");

if(process.env.NULLLOGGER_NO_COLOR)
  throw new Error("Color Disabled for NullLogger");

const inspectOpts = { colors: true };

export = class CliColorLoggerImpl extends BaseLoggerImpl {
  filename = __filename;
  inspect0(object: any) {
    if(object instanceof ColoredText) {
      var _clc: (text: string) => string;
      if (typeof object.color === "string")
        _clc = clc[object.color];
      else
        try {
          _clc = clc.xterm(object.color);
        } catch(e) {}
      if(_clc)
        return _clc(object.text);
      return object.text;
    }
    return util.inspect(object, inspectOpts);
  }
  tag(level: LoggerLevel) {
    var color: Function;
    switch (level) {
      case LoggerLevel.Performance:
      case LoggerLevel.Timer:
        color = clc.blue;
        break;

      case LoggerLevel.Information:
        return super.tag(level);

      case LoggerLevel.Warning:
        color = clc.yellow;
        break;

      case LoggerLevel.Error:
      case LoggerLevel.Fatal:
        color = clc.red;
        break;

      case LoggerLevel.Debugging:
        color = clc.white;
        break;

      default:
        color = clc.blackBright;
        break;
    }

    return color(super.tag(level));
  }
  buildScopeCache(loggerOrScopes: NullLogger | string[] | string) {
    var scopeCache = "";
    if(loggerOrScopes) {
      const processScope = function(scope: CleanedScope) {
        if(!scope)
          return;

        if(scopeCache)
          scopeCache += " ";

        if(scope instanceof ColoredText) {
          var _clc: Function;
          var color = scope.color;
          if (typeof color === "string")
            _clc = clc[color];
          else
            try {
              _clc = clc.xterm(color);
            } catch(e) {}

          if(_clc)
            scopeCache += _clc(`*${scope.text}*`);
          else
            scopeCache += `*${scope.text}*`;
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
