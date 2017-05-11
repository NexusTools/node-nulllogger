declare module nulllogger {
    enum LoggerLevel {
        Gears = 0, // Internal low-level mechanisms
        Debugging = 1, // Basic debugging
        Debug = 1,
        Performance = 2, // Performance related
        Perf = 2,
        Timer = 3, // Timers
        Information = 4, // Informative
        Info = 4,
        Warning = 5, // Warnings
        Warn = 5,
        Error = 6, // Errors
        Fatal = 7, // Possibly unrecoverable

        Silent = 8 // The highest possible level, meant to make things silent
    }

    interface INullLogger {
        extend(...scopes: string[]): INullLogger;
        
        gears(...arguments: any[]): void;
        debug(...arguments: any[]): void;
        debugging(...arguments: any[]): void;
        perf(...arguments: any[]): void;
        performance(...arguments: any[]): void;
        timer(name: string, impl: (logger: INullLogger) => void): void;
        timerAsync(name: string, impl: (logger: INullLogger, cb: Function) => void): void;
        info(...arguments: any[]): void;
        information(...arguments: any[]): void;
        warn(...arguments: any[]): void;
        warning(...arguments: any[]): void;
        error(...arguments: any[]): void;
        group(name: string, impl: (logger: INullLogger) => void): void;
        
        updateScopeName(scope: string, index?: number): void;
        scopeName(index?: number): string;
    }
    
    interface INullLoggerStatic {
        Color: any;
        Level: typeof LoggerLevel;

        new (...scopes: string[]): INullLogger;
        (...scopes: string[]): INullLogger;
        
        /**
         * Returns the minimum logging level, if supported by the implementation
         */
        minLevel(): LoggerLevel;
        /**
         * Sets the minimum logging level, if supported by the implementation
         */
        setMinLevel(level: LoggerLevel);

        gears(...arguments: any[]): void;
        debug(...arguments: any[]): void;
        debugging(...arguments: any[]): void;
        perf(...arguments: any[]): void;
        performance(...arguments: any[]): void;
        timer(name: string, impl: (logger: INullLogger) => void): void;
        info(...arguments: any[]): void;
        information(...arguments: any[]): void;
        warn(...arguments: any[]): void;
        warning(...arguments: any[]): void;
        error(...arguments: any[]): void;
        group(name: string, impl: (logger: INullLogger) => void): void;
        
        log(level: LoggerLevel, loggerOrScopesOrScopeCache: INullLogger|string[]|string, messages: any[]): void;
        
        /**
         * Returns or modifies an environ to tell the subprocess' NullLogger to forward all messages via process.send
         */
        env(env?: any): any;
        /**
         * Returns the filename of the current implementation
         */
        impl(): string;
    }

    var NullLoggerStatic: INullLoggerStatic;
}
declare module "nulllogger" {
    export = nulllogger.NullLoggerStatic;
}