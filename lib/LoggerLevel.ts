enum LoggerLevel {
    Gears, // Internal low-level mechanisms
    Performance, // Performance related
    Debugging, // Basic debugging
    Timer, // Timers
    Information, // Informative
    Warning, // Warnings
    Error, // Errors
    Fatal, // Possibly unrecoverable
    
    Silent // The highest possible level, meant to make things silent
}

// Aliases
LoggerLevel.Debug = LoggerLevel.Debugging;
LoggerLevel.Info = LoggerLevel.Information;
LoggerLevel.Warn = LoggerLevel.Warning;

@main LoggerLevel