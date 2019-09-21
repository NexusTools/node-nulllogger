"use strict";
/// <reference types="node" />
var BaseLoggerImpl;
var ColoredText;
module.exports = class NullLogger {
    constructor(...scopes) {
        this.isDeathRun = false;
        this.scopes = scopes;
    }
    static makeColored(text, color) {
        return new (ColoredText || (ColoredText = require("./baseimpl").ColoredText))(text, color);
    }
    static makeLoggerImpl() {
        if (process.env.LOGGER_IMPL) {
            var plugin = require(process.env.LOGGER_IMPL);
            if (plugin.default)
                return new (plugin.default);
            return new plugin();
        }
        var plugins = [
            "0-silent-logger",
            "1-cli-color-logger",
            "2-text-logger"
        ];
        var $break = new Object();
        var _impl;
        try {
            plugins.forEach(function (plugin) {
                try {
                    plugin = require("./impl/" + plugin);
                    _impl = new plugin();
                }
                catch (e) {
                    return;
                }
                throw $break;
            });
        }
        catch (e) {
            if (e !== $break)
                throw e;
        }
        return _impl;
    }
    /**
     * Log data to the specified implementation.
     *
     * @param level The logging level to use
     * @param loggerOrScopes The logger, scope(s)
     * @param messages The message data to log
     * @param impl The logger implementation
     */
    static log(level, loggerOrScopes, messages, impl = NullLogger.active) {
        return (impl || NullLogger.active || (NullLogger.active = NullLogger.makeLoggerImpl())).log(level, loggerOrScopes, messages);
    }
    /**
     * Log with gears level
     *
     * @param messages The message data to log
     */
    static gears(...messages) {
        NullLogger.log(0 /* Gears */, undefined, messages);
    }
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    static performance(...messages) {
        NullLogger.log(2 /* Performance */, undefined, messages);
    }
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    static perf(...messages) {
        NullLogger.log(2 /* Performance */, undefined, messages);
    }
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    static debugging(...messages) {
        NullLogger.log(1 /* Debugging */, undefined, messages);
    }
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    static debug(...messages) {
        NullLogger.log(1 /* Debugging */, undefined, messages);
    }
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    static info(...messages) {
        NullLogger.log(4 /* Information */, undefined, messages);
    }
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    static information(...messages) {
        NullLogger.log(4 /* Information */, undefined, messages);
    }
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    static warn(...messages) {
        NullLogger.log(5 /* Warning */, undefined, messages);
    }
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    static warning(...messages) {
        NullLogger.log(5 /* Warning */, undefined, messages);
    }
    /**
     * Log with error level
     *
     * @param messages The message data to log
     */
    static error(...messages) {
        NullLogger.log(7 /* Fatal */, undefined, messages);
    }
    /**
     * Log with fatal level, then exit with code 1
     *
     * @param messages The message data to log
     */
    static fatal(...messages) {
        NullLogger.log(7 /* Fatal */, undefined, messages);
        process.exit(1);
    }
    /**
     * Change the minimum logging level
     *
     * @param level The new minimum logging level to use
     */
    static setMinLevel(level) {
        if (!BaseLoggerImpl)
            BaseLoggerImpl = require("./baseimpl").default;
        if (typeof level === "string")
            BaseLoggerImpl.setMinLevel(level);
        else
            BaseLoggerImpl.MIN_LEVEL = level;
    }
    /**
     * Return the minimum logging level
     */
    static minLevel() {
        if (!BaseLoggerImpl)
            BaseLoggerImpl = require("./baseimpl").default;
        return BaseLoggerImpl.MIN_LEVEL;
    }
    /**
     * Return the filename of the logging implementation, when available
     */
    static impl() {
        return NullLogger.active.filename;
    }
    /**
     * Log with gears level
     *
     * @param messages The message data to log
     */
    gears(...messages) {
        NullLogger.log(0 /* Gears */, this, messages);
        return this;
    }
    /**
     * Measure the duration a function takes to execuse.
     * If the function returns a promise, waits for the promise to complete.
     *
     * @param name The name of the timer
     * @param impl The function implementation to measure
     */
    timer(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(3 /* Timer */, logger, ["Running function", name]);
        var start = +new Date;
        const promise = impl(logger);
        if (promise instanceof Promise) {
            promise.catch(function (err) {
                NullLogger.log(6 /* Error */, logger, ["Function", name, "errored:", err]);
            });
            promise.finally(function () {
                NullLogger.log(3 /* Timer */, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
            });
        }
        else
            NullLogger.log(3 /* Timer */, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
        return this;
    }
    /**
     * Measure the duration a function takes to execuse, in a inherently asynchronious way.
     *
     * @param name The name of the timer
     * @param impl The function implementation to measure
     */
    timerAsync(name, impl) {
        var logger = this.extend(name);
        NullLogger.log(3 /* Timer */, logger, ["Starting function", name]);
        var start = +new Date;
        impl(logger, function (err) {
            if (err instanceof Error)
                NullLogger.log(6 /* Error */, logger, ["Function", name, "errored:", err]);
            NullLogger.log(3 /* Timer */, logger, ["Function", name, "took " + ((+new Date) - start) + "ms."]);
        });
        return this;
    }
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    performance(...messages) {
        NullLogger.log(2 /* Performance */, this, messages);
        return this;
    }
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    perf(...messages) {
        NullLogger.log(2 /* Performance */, this, messages);
        return this;
    }
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    debugging(...messages) {
        NullLogger.log(1 /* Debugging */, this, messages);
        return this;
    }
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    debug(...messages) {
        NullLogger.log(1 /* Debugging */, this, messages);
        return this;
    }
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    info(...messages) {
        NullLogger.log(4 /* Information */, this, messages);
        return this;
    }
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    information(...messages) {
        NullLogger.log(4 /* Information */, this, messages);
        return this;
    }
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    warn(...messages) {
        NullLogger.log(5 /* Warning */, this, messages);
        return this;
    }
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    warning(...messages) {
        NullLogger.log(5 /* Warning */, this, messages);
        return this;
    }
    /**
     * Log with error level
     *
     * @param messages The message data to log
     */
    error(...messages) {
        NullLogger.log(6 /* Error */, this, messages);
        return this;
    }
    /**
     * Log with error level, and exit with code 1 after
     *
     * @param messages The message data to log
     */
    fatal(...messages) {
        NullLogger.log(7 /* Fatal */, this, messages);
        process.exit(1);
    }
    /**
     * Return a new NullLogger that extends this one
     *
     * @param messages The message data to log
     */
    extend(...scopes) {
        var merged = this.scopes.slice(0);
        merged.push.apply(merged, scopes);
        var logger = new NullLogger();
        logger.scopes = merged;
        return logger;
    }
    /**
     * Execute within a group, using a new temporary NullLogger
     *
     * @param messages The message data to log
     */
    group(name, impl) {
        impl(this.extend(name));
        return this;
    }
    /**
     * Update a specific scope at a specific index
     *
     * @param messages The message data to log
     */
    updateScopeName(scope, index = -1) {
        if (index < 0)
            this.scopes[this.scopes.length + index] = scope;
        else
            this.scopes[index] = scope;
        delete this.scopeCache;
        return this;
    }
    /**
     * Return a specific scope at a specific index
     *
     * @param messages The message data to log
     */
    scopeName(index = -1) {
        if (index < 0)
            return this.scopes[this.scopes.length + index];
        else
            return this.scopes[index];
    }
    static useWithDeathHandler(scriptToRun, ondeath, implementation) {
        try {
            require('death')(function (signal, err) {
                if (ondeath)
                    ondeath(signal, err);
            });
        }
        catch (e) {
        }
    }
};
//# sourceMappingURL=logger.js.map