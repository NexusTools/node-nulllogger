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

	interface ILoggerImpl {
		log(level:LoggerLevel, scopes:string[], message:any[], out:NodeJS.WritableStream):void;
		shouldAsync():boolean;
	}

	interface INullLogger {
		extend(...scopes:string[]):INullLogger;
		gears(...arguments:any[]):void;
		debug(...arguments:any[]):void;
		debugging(...arguments:any[]):void;
		perf(...arguments:any[]):void;
		performance(...arguments:any[]):void;
		timer(name:string,impl:(logger:INullLogger) => void):void;
		info(...arguments:any[]):void;
		information(...arguments:any[]):void;
		warn(...arguments:any[]):void;
		warning(...arguments:any[]):void;
		error(...arguments:any[]):void;
		group(name:string,impl:(logger:INullLogger) => void):void;
	}

	export var INullLoggerStatic : {
		Color:any;
		Level:any;
		
		new(...scopes:string[]):INullLogger;
		(...scopes:string[]):INullLogger;
		
		gears(...arguments:any[]):void;
		debug(...arguments:any[]):void;
		debugging(...arguments:any[]):void;
		perf(...arguments:any[]):void;
		performance(...arguments:any[]):void;
		timer(name:string,impl:(logger:INullLogger) => void):void;
		info(...arguments:any[]):void;
		information(...arguments:any[]):void;
		warn(...arguments:any[]):void;
		warning(...arguments:any[]):void;
		error(...arguments:any[]):void;
		group(name:string,impl:(logger:INullLogger) => void):void;
	}
}
declare module "nulllogger" {
	export = nulllogger.INullLoggerStatic;
}