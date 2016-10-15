import _ = require("lodash");
import stream = require("stream");

import {LoggerLevel,ILoggerImpl} from "./Def";

export default class BuiltInLoggerImpl implements ILoggerImpl {
    public static _minlevel:LoggerLevel;
    public static _start = Date.now();
    
    static isVerbose(level:LoggerLevel) {
        return level >= BuiltInLoggerImpl._minlevel;
    }
	
	static levelStr(level:number):string {
		switch(level) {
			case LoggerLevel.Gears:
				return "Gears";

			case LoggerLevel.Debugging:
				return "Debug";

			case LoggerLevel.Performance:
				return "Perf ";

			case LoggerLevel.Timer:
				return "Timer";

			case LoggerLevel.Information:
				return "Info ";

			case LoggerLevel.Warning:
				return "Warn ";

			case LoggerLevel.Error:
				return "Error";

			case LoggerLevel.Fatal:
				return "Fatal";

			default:
				return " ??? ";

		}
	}
	
	static stringForObject(object:any):string {
		try {
			try {
				if(object instanceof Error) {
					if(object.stack)
						return object.stack;

					return "" + object;
				}
			} catch(e) {}

			if(_.isArray(object))
				return JSON.stringify(object);

			if(_.isObject(object)) {
				var type = object.constructor.name;
				if(type == "String")
					throw "A string";

				var str:string, showName:boolean;
				if(showName = (type != "Object"))
					str = type + "(";
				else
					str = "";

				try {
					if(object instanceof Date)
						str += object.getTime();
					else
						switch(type) {
							case "RegExp":
								throw "No JSON";

							default:
								str += JSON.stringify(object);
								break;

						}
				} catch(e) {
					str += object;
				}

				if(showName)
					str += ")";

				return str;
			}

			throw "Unhandled";
		} catch(e) {
			if(e instanceof Error)
				console.error(e);

			return "" + object;
		}
	}
    
    static elapsed() {
        var elapsed = Date.now() - BuiltInLoggerImpl._start;
        
        var tim = String(elapsed%1000);
        while(tim.length < 3)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/1000))%60 + "." + tim;
        while(tim.length < 6)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
        while(tim.length < 9)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
        while(tim.length < 12)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/24))%24 + " " + tim;
        while(tim.length < 15)
            tim = "0" + tim;
        
        return tim;
    }
    
	static write(message: any, out: NodeJS.WritableStream) {
		out.write(BuiltInLoggerImpl.stringForObject(message));
    }
	
	log(level:LoggerLevel, scopes:any[][], message:any[], out:NodeJS.WritableStream):void {
		throw new Error("Not implemented here");
	}
	
	shouldAsync():boolean {
		return true;
	}
	
}

if(process.env.VERBOSE) {
    var verbose:any = parseFloat(process.env.VERBOSE);
    if(isFinite(verbose) && !isNaN(verbose))
        BuiltInLoggerImpl._minlevel = 8-verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if(!(verbose in LoggerLevel))
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");
        
		switch(LoggerLevel[verbose]) {
			default:
				BuiltInLoggerImpl._minlevel = LoggerLevel.Gears;
				break;
			case "Debug":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Debug;
				break;
			case "Perf":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Perf;
				break;
			case "Timer":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Timer;
				break;
			case "Info":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Info;
				break;
			case "Warn":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Warn;
				break;
			case "Error":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Error;
				break;
			case "Fatal":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Fatal;
				break;
			case "Silent":
				BuiltInLoggerImpl._minlevel = LoggerLevel.Silent;
				break;
		}
		//BuiltInLoggerImpl._minlevel = LoggerLevel[verbose];
		console.log(BuiltInLoggerImpl._minlevel);
    }
} else if(process.env.NODE_ENV === "test")
	BuiltInLoggerImpl._minlevel = LoggerLevel.Debugging;
else
    BuiltInLoggerImpl._minlevel = LoggerLevel.Timer;