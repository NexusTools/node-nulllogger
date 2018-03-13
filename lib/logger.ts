/// <reference types="node" />

import path = require("path");

import { LoggerLevel, INullLogger, ILoggerImpl, Color } from "../types";

export = class NullLogger implements INullLogger {
    private static Impl: ILoggerImpl;

    _scopeCache: any;
    _scopes: string[];
    constructor(...scopes: string[]) {
        this._scopes = scopes;
    }

    private static _init() {
        if (process.env.LOGGER_IMPL)
            return require(process.env.LOGGER_IMPL);

        var plugins: any[] = [
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
        var _impl: ILoggerImpl;
        var lastErr: Error;
        try {
            plugins.forEach(function(plugin) {
                try {
                    plugin = require(path.resolve(pluginDir, plugin[1]));
                    _impl = new plugin();
                    if (_impl.disabled)
                        throw new Error("Disabled");
                } catch (e) {
                    lastErr = e;
                    return;
                }
                throw $break;
            });
        } catch (e) {
            if (e !== $break)
                throw e;
        }
        if (!_impl)
            throw new Error("Could not create logging implementation: " + lastErr);
        return _impl;
    }

    static log(level: LoggerLevel, loggerOrScopesOrScopeCache: INullLogger|string[]|string, messages: any[]) {
        if (!NullLogger.Impl)
            NullLogger.Impl = NullLogger._init();

        if(Array.isArray(loggerOrScopesOrScopeCache)) {
            if(NullLogger.Impl.buildScopeCache)
                loggerOrScopesOrScopeCache = NullLogger.Impl.buildScopeCache(loggerOrScopesOrScopeCache as string[]);
            else
                throw new Error("Implementation missing buildScopeCache, cannot handle unprocessed scopes");
        }
        return NullLogger.Impl.log(level, loggerOrScopesOrScopeCache as INullLogger|string, messages);
    }

    static gears(...messages: any[]) {
        NullLogger.log(LoggerLevel.Gears, undefined, messages);
    }

    static performance(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, undefined, messages);
    }

    static perf(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, undefined, messages);
    }

    static debugging(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, undefined, messages);
    }

    static debug(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, undefined, messages);
    }

    static info(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, undefined, messages);
    }

    static information(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, undefined, messages);
    }

    static warn(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, undefined, messages);
    }

    static warning(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, undefined, messages);
    }

    static error(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, undefined, messages);
    }

    static fatal(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, undefined, messages);
        process.exit(1);
    }
    
    static env(env?: any) {
        env = env || {};
        env.PROCESS_SEND_LOGGER = NullLogger.Impl.filename;
        NullLogger.Impl.extendEnv(env);
        return env;
    }
    
    static setMinLevel?(level: LoggerLevel): void{
        if(NullLogger.Impl.setMinLevel)
            NullLogger.Impl.setMinLevel(level);
    }
    static minLevel?(): LoggerLevel{
        return NullLogger.Impl.minLevel ? NullLogger.Impl.minLevel() : undefined;
    }
    
    static impl() {
        return NullLogger.Impl.filename;
    }

    gears(...messages: any[]) {
        NullLogger.log(LoggerLevel.Gears, this, messages);
        return this;
    }

    timer(name: string, impl: (logger: INullLogger) => void) {
        var logger = this.extend(name);
        NullLogger.log(LoggerLevel.Timer, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger);
        NullLogger.log(LoggerLevel.Timer, logger, ["Took " + ((+new Date) - start) + "ms."]);
        return this;
    }

    timerAsync(name: string, impl: (logger: INullLogger, cb: Function) => void) {
        var logger = this.extend(name);
        NullLogger.log(LoggerLevel.Timer, logger, ["Starting..."]);
        var start = +new Date;
        impl(logger, function() {
            NullLogger.log(LoggerLevel.Timer, logger, ["Took " + ((+new Date) - start) + "ms."]);
        });
        return this;
    }

    performance(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, this, messages);
        return this;
    }

    perf(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, this, messages);
        return this;
    }

    debugging(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, this, messages);
        return this;
    }

    debug(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, this, messages);
        return this;
    }

    info(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, this, messages);
        return this;
    }

    information(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, this, messages);
        return this;
    }

    warn(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, this, messages);
        return this;
    }

    warning(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, this, messages);
        return this;
    }

    error(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, this, messages);
        return this;
    }

    fatal(...messages: any[]) {
        NullLogger.log(LoggerLevel.Fatal, this, messages);
        process.exit(1);
    }

    extend(...scopes: string[]): NullLogger {
        var merged = this._scopes.slice();
        for (var i = 0; i < scopes.length; i++)
            merged.push(scopes[i]);

        var logger = new NullLogger();
        logger._scopes = merged;
        return logger;
    }

    group(name: string, impl: (logger: INullLogger) => void) {
        impl(this.extend(name));
        return this;
    }
    
    updateScopeName(scope: string, index = -1) {
        if(index < 0)
            this._scopes[this._scopes.length + index] = scope;
        else
            this._scopes[index] = scope;
        delete this._scopeCache;
        return this;
    }
    
    scopeName(index: number = -1) {
        if(index < 0)
            return this._scopes[this._scopes.length + index];
        else
            return this._scopes[index];
    }

}