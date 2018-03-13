"use strict";
/// <reference types="node" />
const path = require("path");
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
        /*var pluginFormat = /^(\d+)\-.+\.js$/;
        fs.readdirSync(pluginDir).forEach(function(file) {
            var matches = file.match(pluginFormat);
            if (matches)
                plugins.push([parseInt(matches[1]), file]);
        });
        plugins.sort(function(a, b) { return a[0] - b[0] });*/
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
        NullLogger.log(0 /* Gears */, undefined, messages);
    }
    static performance(...messages) {
        NullLogger.log(2 /* Performance */, undefined, messages);
    }
    static perf(...messages) {
        NullLogger.log(2 /* Performance */, undefined, messages);
    }
    static debugging(...messages) {
        NullLogger.log(1 /* Debugging */, undefined, messages);
    }
    static debug(...messages) {
        NullLogger.log(1 /* Debugging */, undefined, messages);
    }
    static info(...messages) {
        NullLogger.log(4 /* Information */, undefined, messages);
    }
    static information(...messages) {
        NullLogger.log(4 /* Information */, undefined, messages);
    }
    static warn(...messages) {
        NullLogger.log(5 /* Warning */, undefined, messages);
    }
    static warning(...messages) {
        NullLogger.log(5 /* Warning */, undefined, messages);
    }
    static error(...messages) {
        NullLogger.log(6 /* Error */, undefined, messages);
    }
    static fatal(...messages) {
        NullLogger.log(6 /* Error */, undefined, messages);
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
        NullLogger.log(0 /* Gears */, this, messages);
        return this;
    }
    timer(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(3 /* Timer */, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger);
        NullLogger.log(3 /* Timer */, logger, ["Took " + ((+new Date) - start) + "ms."]);
        return this;
    }
    timerAsync(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(3 /* Timer */, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger, function () {
            NullLogger.log(3 /* Timer */, logger, ["Took " + ((+new Date) - start) + "ms."]);
        });
        return this;
    }
    performance(...messages) {
        NullLogger.log(2 /* Performance */, this, messages);
        return this;
    }
    perf(...messages) {
        NullLogger.log(2 /* Performance */, this, messages);
        return this;
    }
    debugging(...messages) {
        NullLogger.log(1 /* Debugging */, this, messages);
        return this;
    }
    debug(...messages) {
        NullLogger.log(1 /* Debugging */, this, messages);
        return this;
    }
    info(...messages) {
        NullLogger.log(4 /* Information */, this, messages);
        return this;
    }
    information(...messages) {
        NullLogger.log(4 /* Information */, this, messages);
        return this;
    }
    warn(...messages) {
        NullLogger.log(5 /* Warning */, this, messages);
        return this;
    }
    warning(...messages) {
        NullLogger.log(5 /* Warning */, this, messages);
        return this;
    }
    error(...messages) {
        NullLogger.log(6 /* Error */, this, messages);
        return this;
    }
    fatal(...messages) {
        NullLogger.log(7 /* Fatal */, this, messages);
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
        return this;
    }
    updateScopeName(scope, index = -1) {
        if (index < 0)
            this._scopes[this._scopes.length + index] = scope;
        else
            this._scopes[index] = scope;
        delete this._scopeCache;
        return this;
    }
    scopeName(index = -1) {
        if (index < 0)
            return this._scopes[this._scopes.length + index];
        else
            return this._scopes[index];
    }
};
//# sourceMappingURL=logger.js.map