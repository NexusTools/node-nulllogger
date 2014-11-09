@nodereq stream
@nodereq path
@nodereq fs

@reference LoggerImpl
@include LoggerLevel

class Logger {
    private static _impl:LoggerImpl;
    private static _out:(level:LoggerImpl) => stream.Writable = function(level:LoggerImpl) {
        if(level >= LoggerLevel.Error)
            return process.stderr;
        else
            return process.stdout;
    };

    static setStreamProvider(out:stream.Writable) {
        Logger._out = out;
    }

    private _scopes:string[];
    constructor(...scopes:string[]) {
        if(!(this instanceof Logger)) {
            var instance = new Logger();
            instance._scopes = scopes;
            return instance;
        }
        
        this._scopes = scopes;
    }

    private static _init() {
        if(process.env.LOGGER_IMPL)
            return require(process.env.LOGGER_IMPL);
        
        var path = require("path");
        var pkg = require(path.resolve(require.main.id, "package.json"));
        if(pkg.loggerImpl) {
            // TODO: Load typescript plugins
            return require(pkg.loggerImpl);
        }
        
        var plugins = [];
        var pluginFormat = /^(\d+)\-.+\.ts$/;
        var pluginDir = path.resolve(__dirname, "LoggerImpl");
        fs.readdirSync(pluginDir).forEach(function(file) {
            var matches = file.match(pluginFormat);
            if(matches)
                plugins.push([matches[1]*1, file]);
        });
        plugins.sort(function(a, b){return a[0]-b[0]});
        
        var $break = new Object();
        var _impl;
        try {
            plugins.forEach(function(plugin) {
                try {
                    plugin = _typeinclude(path.resolve(pluginDir, plugin[1]));
                    _impl = new plugin();
                } catch(e) {
                    return;
                }
                throw $break;
            });
        } catch(e) {
            if(e !== $break)
                throw e;
        }
        return _impl;
    }

    static log(level:LoggerLevel, scopes:string[], messages:any[]) {
        if(!Logger._impl)
            Logger._impl = this._init();
        
        return this._impl.log(level, scopes, messages, Logger._out(level));
    }

    static gears(...messages:any[]) {
        Logger.log(LoggerLevel.Gears, undefined, messages);
    }

    static performance(...messages:any[]) {
        Logger.log(LoggerLevel.Performance, undefined, messages);
    }

    static perf(...messages:any[]) {
        Logger.log(LoggerLevel.Performance, undefined, messages);
    }

    static debugging(...messages:any[]) {
        Logger.log(LoggerLevel.Debug, undefined, messages);
    }

    static debug(...messages:any[]) {
        Logger.log(LoggerLevel.Debug, undefined, messages);
    }

    static info(...messages:any[]) {
        Logger.log(LoggerLevel.Information, undefined, messages);
    }

    static information(...messages:any[]) {
        Logger.log(LoggerLevel.Information, undefined, messages);
    }

    static warn(...messages:any[]) {
        Logger.log(LoggerLevel.Warning, undefined, messages);
    }

    static warning(...messages:any[]) {
        Logger.log(LoggerLevel.Warning, undefined, messages);
    }

    static error(...messages:any[]) {
        Logger.log(LoggerLevel.Error, undefined, messages);
    }

    static fatal(...messages:any[]) {
        Logger.log(LoggerLevel.Error, undefined, messages);
        process.exit(1);
    }

    gears(...messages:any[]) {
        Logger.log(LoggerLevel.Gears, this._scopes, messages);
    }

    performance(...messages:any[]) {
        Logger.log(LoggerLevel.Performance, this._scopes, messages);
    }

    perf(...messages:any[]) {
        Logger.log(LoggerLevel.Performance, this._scopes, messages);
    }

    debugging(...messages:any[]) {
        Logger.log(LoggerLevel.Debug, this._scopes, messages);
    }

    debug(...messages:any[]) {
        Logger.log(LoggerLevel.Debug, this._scopes, messages);
    }

    info(...messages:any[]) {
        Logger.log(LoggerLevel.Information, this._scopes, messages);
    }

    information(...messages:any[]) {
        Logger.log(LoggerLevel.Information, this._scopes, messages);
    }

    warn(...messages:any[]) {
        Logger.log(LoggerLevel.Warning, this._scopes, messages);
    }

    warning(...messages:any[]) {
        Logger.log(LoggerLevel.Warning, this._scopes, messages);
    }

    error(...messages:any[]) {
        Logger.log(LoggerLevel.Error, this._scopes, messages);
    }

    fatal(...messages:any[]) {
        Logger.log(LoggerLevel.Fatal, this._scopes, messages);
        process.exit(1);
    }

}

@main Logger