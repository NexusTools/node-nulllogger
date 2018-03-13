/// <reference types="node" />
import { INullLogger, LoggerLevel } from "../../types";
declare const _default: {
    new (): {
        disabled: any;
        filename: string;
        inspect0(object: any): string;
        tag(level: LoggerLevel): any;
        buildScopeCache(scopes: string[]): string;
        extendEnv(env: any): void;
        levelStr(level: number): string;
        timestamp(): string;
        log(level: LoggerLevel, loggerOrScopeCache: string | INullLogger, message: any[]): void;
        setMinLevel?(level: LoggerLevel): void;
        minLevel?(): LoggerLevel;
    };
    HEXREGEXP: RegExp;
    cleanScope(scope: string): any[];
    cleanScopes(scopes?: string[]): any[][];
    MIN_LEVEL: LoggerLevel;
    MONTHS: string[];
    SCOPEREGEXP: RegExp;
    OUT: NodeJS.WriteStream;
    ERR: NodeJS.WriteStream;
    isVerbose(level: LoggerLevel): boolean;
    pad(val: number, amnt?: number): string;
};
export = _default;
