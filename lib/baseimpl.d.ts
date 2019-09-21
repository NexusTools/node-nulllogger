/// <reference types="node" />
import { LoggerLevel, ILoggerImpl } from "../types";
import NullLogger = require("./logger");
export interface ScopeWithColor {
    [0]: string | number;
    [1]: string;
}
export declare type CleanedScope = string | ScopeWithColor;
export declare const colorMappings: {
    "e": string;
    "E": string;
    "Black": string;
    "BLACK": string;
    "r": string;
    "R": string;
    "Red": string;
    "RED": string;
    "g": string;
    "G": string;
    "Green": string;
    "GREEN": string;
    "y": string;
    "Y": string;
    "Yellow": string;
    "YELLOW": string;
    "b": string;
    "B": string;
    "Blue": string;
    "BLUE": string;
    "m": string;
    "M": string;
    "Magenta": string;
    "MAGENTA": string;
    "c": string;
    "C": string;
    "Cyan": string;
    "CYAN": string;
    "w": string;
    "W": string;
    "White": string;
    "WHITE": string;
};
export declare const MONTHS: string[];
export declare const SCOPEREGEXP: RegExp;
export declare const HEXREGEXP: RegExp;
export declare class ColoredText {
    readonly text: string;
    readonly color: string | number;
    constructor(text: string, color: string | number);
    toString(): string;
}
declare abstract class BaseLoggerImpl implements ILoggerImpl {
    static MIN_LEVEL: LoggerLevel;
    static OUT: NodeJS.WriteStream;
    static ERR: NodeJS.WriteStream;
    filename: string;
    static parseScopes(scopes: string[], scopesIsCopy?: boolean): CleanedScope[];
    static isVerbose(level: LoggerLevel): boolean;
    levelStr(level: number): string;
    static pad(val: number, amnt?: number): string;
    static formatDate(date?: Date): string;
    static setMinLevel(minLevel: string): void;
    timestamp: () => string;
    tag(level: LoggerLevel): string;
    inspect0(object: any): string;
    abstract buildScopeCache(scopes: NullLogger | string[] | string): string;
    log(level: LoggerLevel, loggerOrScopes: NullLogger | string[] | string, message: any[]): void;
}
export default BaseLoggerImpl;
