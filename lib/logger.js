"use strict";
const path = require("path");
const def_1 = require("./def");
module.exports = class NullLogger {
    constructor(...scopes) {
        this._scopes = scopes;
    }
    static _init() {
        if (process.env.LOGGER_IMPL)
            return require(process.env.LOGGER_IMPL);
        var plugins = [
            [0, "0-send-process.js"],
            [98, "98-silent-logger.js"],
            [99, "99-cli-color-logger.js"],
            [100, "100-text-logger.js"]
        ];
        var pluginDir = path.resolve(__dirname, "impl");
        var $break = new Object();
        var _impl;
        var lastErr;
        try {
            plugins.forEach(function (plugin) {
                try {
                    plugin = require(path.resolve(pluginDir, plugin[1]));
                    _impl = new plugin();
                    if (_impl.disabled)
                        throw new Error("Disabled");
                }
                catch (e) {
                    lastErr = e;
                    return;
                }
                throw $break;
            });
        }
        catch (e) {
            if (e !== $break)
                throw e;
        }
        if (!_impl)
            throw new Error("Could not create logging implementation: " + lastErr);
        return _impl;
    }
    static log(level, loggerOrScopesOrScopeCache, messages) {
        if (!NullLogger.Impl)
            NullLogger.Impl = NullLogger._init();
        if (Array.isArray(loggerOrScopesOrScopeCache)) {
            if (NullLogger.Impl.buildScopeCache)
                loggerOrScopesOrScopeCache = NullLogger.Impl.buildScopeCache(loggerOrScopesOrScopeCache);
            else
                throw new Error("Implementation missing buildScopeCache, cannot handle unprocessed scopes");
        }
        return NullLogger.Impl.log(level, loggerOrScopesOrScopeCache, messages);
    }
    static gears(...messages) {
        NullLogger.log(def_1.LoggerLevel.Gears, undefined, messages);
    }
    static performance(...messages) {
        NullLogger.log(def_1.LoggerLevel.Performance, undefined, messages);
    }
    static perf(...messages) {
        NullLogger.log(def_1.LoggerLevel.Performance, undefined, messages);
    }
    static debugging(...messages) {
        NullLogger.log(def_1.LoggerLevel.Debugging, undefined, messages);
    }
    static debug(...messages) {
        NullLogger.log(def_1.LoggerLevel.Debugging, undefined, messages);
    }
    static info(...messages) {
        NullLogger.log(def_1.LoggerLevel.Information, undefined, messages);
    }
    static information(...messages) {
        NullLogger.log(def_1.LoggerLevel.Information, undefined, messages);
    }
    static warn(...messages) {
        NullLogger.log(def_1.LoggerLevel.Warning, undefined, messages);
    }
    static warning(...messages) {
        NullLogger.log(def_1.LoggerLevel.Warning, undefined, messages);
    }
    static error(...messages) {
        NullLogger.log(def_1.LoggerLevel.Error, undefined, messages);
    }
    static fatal(...messages) {
        NullLogger.log(def_1.LoggerLevel.Error, undefined, messages);
        process.exit(1);
    }
    static env(env) {
        env = env || {};
        env.PROCESS_SEND_LOGGER = NullLogger.Impl.filename;
        NullLogger.Impl.extendEnv(env);
        return env;
    }
    static setMinLevel(level) {
        if (NullLogger.Impl.setMinLevel)
            NullLogger.Impl.setMinLevel(level);
    }
    static minLevel() {
        return NullLogger.Impl.minLevel ? NullLogger.Impl.minLevel() : undefined;
    }
    static impl() {
        return NullLogger.Impl.filename;
    }
    gears(...messages) {
        NullLogger.log(def_1.LoggerLevel.Gears, this, messages);
    }
    timer(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(def_1.LoggerLevel.Timer, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger);
        NullLogger.log(def_1.LoggerLevel.Timer, logger, ["Took " + ((+new Date) - start) + "ms."]);
    }
    timerAsync(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(def_1.LoggerLevel.Timer, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger, function () {
            NullLogger.log(def_1.LoggerLevel.Timer, logger, ["Took " + ((+new Date) - start) + "ms."]);
        });
    }
    performance(...messages) {
        NullLogger.log(def_1.LoggerLevel.Performance, this, messages);
    }
    perf(...messages) {
        NullLogger.log(def_1.LoggerLevel.Performance, this, messages);
    }
    debugging(...messages) {
        NullLogger.log(def_1.LoggerLevel.Debugging, this, messages);
    }
    debug(...messages) {
        NullLogger.log(def_1.LoggerLevel.Debugging, this, messages);
    }
    info(...messages) {
        NullLogger.log(def_1.LoggerLevel.Information, this, messages);
    }
    information(...messages) {
        NullLogger.log(def_1.LoggerLevel.Information, this, messages);
    }
    warn(...messages) {
        NullLogger.log(def_1.LoggerLevel.Warning, this, messages);
    }
    warning(...messages) {
        NullLogger.log(def_1.LoggerLevel.Warning, this, messages);
    }
    error(...messages) {
        NullLogger.log(def_1.LoggerLevel.Error, this, messages);
    }
    fatal(...messages) {
        NullLogger.log(def_1.LoggerLevel.Fatal, this, messages);
        process.exit(1);
    }
    extend(...scopes) {
        var merged = this._scopes.slice();
        for (var i = 0; i < scopes.length; i++)
            merged.push(scopes[i]);
        var logger = new NullLogger();
        logger._scopes = merged;
        return logger;
    }
    group(name, impl) {
        impl(this.extend(name));
    }
    updateScopeName(scope, index = -1) {
        if (index < 0)
            this._scopes[this._scopes.length + index] = scope;
        else
            this._scopes[index] = scope;
        delete this._scopeCache;
    }
    scopeName(index = -1) {
        if (index < 0)
            return this._scopes[this._scopes.length + index];
        else
            return this._scopes[index];
    }
};
//# sourceMappingURL=logger.js.map