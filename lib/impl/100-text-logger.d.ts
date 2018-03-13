/// <reference types="node" />
import { INullLogger, LoggerLevel } from "../../types";
declare const _default: {
    new (): {
        filename: string;
        inspect0(object: any): string;
        buildScopeCache(scopes: string[]): string;
        extendEnv(env: any): void;
        levelStr(level: number): string;
        timestamp(): string;
        tag(level: LoggerLevel): string;
        log(level: LoggerLevel, loggerOrScopeCache: string | INullLogger, message: any[]): void;
        setMinLevel?(level: LoggerLevel): void;
        minLevel?(): LoggerLevel;
    };
    cleanScope(scope: string): string;
    cleanScopes(scopes: string[]): string[];
    MIN_LEVEL: LoggerLevel;
    MONTHS: string[];
    SCOPEREGEXP: RegExp;
    OUT: NodeJS.WriteStream;
    ERR: NodeJS.WriteStream;
    isVerbose(level: LoggerLevel): boolean;
    pad(val: number, amnt?: number): string;
};
export = _default;
