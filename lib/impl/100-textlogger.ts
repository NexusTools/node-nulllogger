import BuiltInLoggerImpl from "../BuiltInLoggerImpl";
import {LoggerLevel} from "../Def";

export = class TextLoggerImpl extends BuiltInLoggerImpl {
	log(level:LoggerLevel, scopes: any[][], messages: any[], out: NodeJS.WritableStream) {
        if(!BuiltInLoggerImpl.isVerbose(level))
            return;
        
		out.write("[");
		out.write(BuiltInLoggerImpl.levelStr(level));
		out.write(" ");
		out.write(BuiltInLoggerImpl.elapsed());
		out.write("]");

		scopes.forEach(function(scope){
			out.write(" *");
			out.write(scope[1]);
			out.write("*");
		});
		
        messages.forEach(function(message){
			out.write(" ");
			out.write(BuiltInLoggerImpl.stringForObject(message));
		});
		
        out.write("\n");
    }
}