export const enum LoggerLevel {
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
    Fatal = 7, // Unrecoverable Errors

    Silent = 7 // The highest possible level, meant to make things silent
}

export interface ILoggerImpl {
    filename: string;
    disabled?: boolean;
    extendEnv?(env: any): any;
    inspect0?(object: any): string;
    log(level: LoggerLevel, loggerOrScopeCache: INullLogger|string[]|string, message: any[]): void;
    buildScopeCache?(scopes: string[] | INullLogger): string;
    minLevel?(): LoggerLevel;
}
