/// <reference types="node" />
import { INullLogger, LoggerLevel, ILoggerImpl } from "../types";
export declare abstract class BaseLoggerImpl implements ILoggerImpl {
    static MIN_LEVEL: LoggerLevel;
    static MONTHS: string[];
    static SCOPEREGEXP: RegExp;
    static OUT: NodeJS.WriteStream;
    static ERR: NodeJS.WriteStream;
    filename: string;
    static isVerbose(level: LoggerLevel): boolean;
    extendEnv(env: any): void;
    levelStr(level: number): string;
    static pad(val: number, amnt?: number): string;
    timestamp(): string;
    tag(level: LoggerLevel): string;
    abstract inspect0(object: any): string;
    abstract buildScopeCache(scopes: string[]): string;
    log(level: LoggerLevel, loggerOrScopeCache: INullLogger | string, message: any[]): void;
    setMinLevel?(level: LoggerLevel): void;
    minLevel?(): LoggerLevel;
}
