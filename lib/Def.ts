export enum LoggerLevel {
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

export enum Color {
	Grey = 0,
	E = 0,
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
	log(level:LoggerLevel, scopes:any[][], message:any[], out:NodeJS.WritableStream):void;
	shouldAsync():boolean;
}

export interface INullLogger {
	_scopes:string[];
	extend(...scopes:string[]):INullLogger;
	gears(...message:any[]):void;
	debug(...message:any[]):void;
	debugging(...message:any[]):void;
	perf(...message:any[]):void;
	performance(...message:any[]):void;
	timer(name:string,impl:(logger:INullLogger) => void):void;
	timerAsync(name:string,impl:(logger:INullLogger,cb:Function) => void):void;
	info(...message:any[]):void;
	information(...message:any[]):void;
	warn(...message:any[]):void;
	warning(...message:any[]):void;
	error(...message:any[]):void;
	group(name:string,impl:(logger:INullLogger) => void):void;
}

export interface INullLoggerConstructor extends INullLogger {
	new(...scopes:string[]):INullLogger;
	(...scopes:string[]):INullLogger;
}