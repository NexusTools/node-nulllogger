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
    Fatal = 7, // Possibly unrecoverable

    Silent = 8 // The highest possible level, meant to make things silent
}

export const enum Color {
    E = 0,
    Grey = 0,
    Black = 0,

    R = 1,
    Red = 1,

    G = 2,
    Green = 2,

    Y = 3,
    Yellow = 3,

    B = 4,
    Blue = 4,

    M = 5,
    Magenta = 5,

    C = 6,
    Cyan = 6,

    W = 7,
    White = 7
}

export interface ILoggerImpl {
    filename: string;
    disabled?: boolean;
    extendEnv?(env: any): any;
    inspect0?(object: any): string;
    log(level: LoggerLevel, loggerOrScopeCache: INullLogger|string, message: any[]): void;
    buildScopeCache?(scopes: string[]): string;
    setMinLevel?(level: LoggerLevel): void;
    minLevel?(): LoggerLevel;
}

export interface INullLogger {
    _scopes: string[];
    _scopeCache: string;
    
    scopeName(index?: number): string;
    updateScopeName(scope: string, index?: number): void;
    
    extend(...scopes: string[]): INullLogger;
    gears(...message: any[]): this;
    debug(...message: any[]): this;
    debugging(...message: any[]): this;
    perf(...message: any[]): this;
    performance(...message: any[]): this;
    timer(name: string, impl: (logger: INullLogger) => void): this;
    timerAsync(name: string, impl: (logger: INullLogger, cb: Function) => void): this;
    info(...message: any[]): this;
    information(...message: any[]): this;
    warn(...message: any[]): this;
    warning(...message: any[]): this;
    error(...message: any[]): this;
    fatal(...message: any[]): void;
    group(name: string, impl: (logger: INullLogger) => void): this;
}