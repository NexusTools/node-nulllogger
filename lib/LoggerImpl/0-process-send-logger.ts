@include LoggerLevel
@reference LoggerImpl

if(!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if(!process.send)
    throw new Error("Process missing send, are you a worker?");

class ProcessSendLogger implements LoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable) {
        process.send([level, scopes, messages]);
    }
	
	shouldAsync():boolean {
		/*
		 Pretty much async already
		 but we should do testing anyway
		 just... later...
		*/
		return false;
	}
}

@main ProcessSendLogger