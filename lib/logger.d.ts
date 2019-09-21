import { LoggerLevel, ILoggerImpl } from "../types";
declare const _default: {
    new (...scopes: string[]): {
        scopeCache: any;
        readonly scopes: string[];
        /**
         * Log with gears level
         *
         * @param messages The message data to log
         */
        gears(...messages: any[]): any;
        /**
         * Measure the duration a function takes to execuse.
         * If the function returns a promise, waits for the promise to complete.
         *
         * @param name The name of the timer
         * @param impl The function implementation to measure
         */
        timer(name: string, impl: (logger: any) => void | Promise<any>): any;
        /**
         * Measure the duration a function takes to execuse, in a inherently asynchronious way.
         *
         * @param name The name of the timer
         * @param impl The function implementation to measure
         */
        timerAsync(name: string, impl: (logger: any, cb: (err?: Error) => void) => void): any;
        /**
         * Log with performance level
         *
         * @param messages The message data to log
         */
        performance(...messages: any[]): any;
        /**
         * Log with performance level
         *
         * @param messages The message data to log
         */
        perf(...messages: any[]): any;
        /**
         * Log with debugging level
         *
         * @param messages The message data to log
         */
        debugging(...messages: any[]): any;
        /**
         * Log with debugging level
         *
         * @param messages The message data to log
         */
        debug(...messages: any[]): any;
        /**
         * Log with information level
         *
         * @param messages The message data to log
         */
        info(...messages: any[]): any;
        /**
         * Log with information level
         *
         * @param messages The message data to log
         */
        information(...messages: any[]): any;
        /**
         * Log with warning level
         *
         * @param messages The message data to log
         */
        warn(...messages: any[]): any;
        /**
         * Log with warning level
         *
         * @param messages The message data to log
         */
        warning(...messages: any[]): any;
        /**
         * Log with error level
         *
         * @param messages The message data to log
         */
        error(...messages: any[]): any;
        /**
         * Log with error level, and exit with code 1 after
         *
         * @param messages The message data to log
         */
        fatal(...messages: any[]): void;
        /**
         * Return a new NullLogger that extends this one
         *
         * @param messages The message data to log
         */
        extend(...scopes: string[]): any;
        /**
         * Execute within a group, using a new temporary NullLogger
         *
         * @param messages The message data to log
         */
        group(name: string, impl: (logger: any) => void): any;
        /**
         * Update a specific scope at a specific index
         *
         * @param messages The message data to log
         */
        updateScopeName(scope: string, index?: number): any;
        /**
         * Return a specific scope at a specific index
         *
         * @param messages The message data to log
         */
        scopeName(index?: number): string;
        readonly isDeathRun: false;
    };
    active: ILoggerImpl;
    makeColored(text: string, color: string | number): any;
    makeLoggerImpl(): any;
    /**
     * Log data to the specified implementation.
     *
     * @param level The logging level to use
     * @param loggerOrScopes The logger, scope(s)
     * @param messages The message data to log
     * @param impl The logger implementation
     */
    log(level: LoggerLevel, loggerOrScopes: string | {
        scopeCache: any;
        readonly scopes: string[];
        /**
         * Log with gears level
         *
         * @param messages The message data to log
         */
        gears(...messages: any[]): any;
        /**
         * Measure the duration a function takes to execuse.
         * If the function returns a promise, waits for the promise to complete.
         *
         * @param name The name of the timer
         * @param impl The function implementation to measure
         */
        timer(name: string, impl: (logger: any) => void | Promise<any>): any;
        /**
         * Measure the duration a function takes to execuse, in a inherently asynchronious way.
         *
         * @param name The name of the timer
         * @param impl The function implementation to measure
         */
        timerAsync(name: string, impl: (logger: any, cb: (err?: Error) => void) => void): any;
        /**
         * Log with performance level
         *
         * @param messages The message data to log
         */
        performance(...messages: any[]): any;
        /**
         * Log with performance level
         *
         * @param messages The message data to log
         */
        perf(...messages: any[]): any;
        /**
         * Log with debugging level
         *
         * @param messages The message data to log
         */
        debugging(...messages: any[]): any;
        /**
         * Log with debugging level
         *
         * @param messages The message data to log
         */
        debug(...messages: any[]): any;
        /**
         * Log with information level
         *
         * @param messages The message data to log
         */
        info(...messages: any[]): any;
        /**
         * Log with information level
         *
         * @param messages The message data to log
         */
        information(...messages: any[]): any;
        /**
         * Log with warning level
         *
         * @param messages The message data to log
         */
        warn(...messages: any[]): any;
        /**
         * Log with warning level
         *
         * @param messages The message data to log
         */
        warning(...messages: any[]): any;
        /**
         * Log with error level
         *
         * @param messages The message data to log
         */
        error(...messages: any[]): any;
        /**
         * Log with error level, and exit with code 1 after
         *
         * @param messages The message data to log
         */
        fatal(...messages: any[]): void;
        /**
         * Return a new NullLogger that extends this one
         *
         * @param messages The message data to log
         */
        extend(...scopes: string[]): any;
        /**
         * Execute within a group, using a new temporary NullLogger
         *
         * @param messages The message data to log
         */
        group(name: string, impl: (logger: any) => void): any;
        /**
         * Update a specific scope at a specific index
         *
         * @param messages The message data to log
         */
        updateScopeName(scope: string, index?: number): any;
        /**
         * Return a specific scope at a specific index
         *
         * @param messages The message data to log
         */
        scopeName(index?: number): string;
        readonly isDeathRun: false;
    } | string[], messages: any[], impl?: ILoggerImpl): any;
    /**
     * Log with gears level
     *
     * @param messages The message data to log
     */
    gears(...messages: any[]): void;
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    performance(...messages: any[]): void;
    /**
     * Log with performance level
     *
     * @param messages The message data to log
     */
    perf(...messages: any[]): void;
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    debugging(...messages: any[]): void;
    /**
     * Log with debugging level
     *
     * @param messages The message data to log
     */
    debug(...messages: any[]): void;
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    info(...messages: any[]): void;
    /**
     * Log with information level
     *
     * @param messages The message data to log
     */
    information(...messages: any[]): void;
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    warn(...messages: any[]): void;
    /**
     * Log with warning level
     *
     * @param messages The message data to log
     */
    warning(...messages: any[]): void;
    /**
     * Log with error level
     *
     * @param messages The message data to log
     */
    error(...messages: any[]): void;
    /**
     * Log with fatal level, then exit with code 1
     *
     * @param messages The message data to log
     */
    fatal(...messages: any[]): void;
    /**
     * Change the minimum logging level
     *
     * @param level The new minimum logging level to use
     */
    setMinLevel(level: string | LoggerLevel): void;
    /**
     * Return the minimum logging level
     */
    minLevel(): LoggerLevel;
    /**
     * Return the filename of the logging implementation, when available
     */
    impl(): string;
    useWithDeathHandler(scriptToRun: string, ondeath?: (signal?: any, err?: any) => void, implementation?: () => void): void;
};
export = _default;
