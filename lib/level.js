var LoggerLevel = {};

LoggerLevel[LoggerLevel["Gears"] = 8] = "Gears";
LoggerLevel[LoggerLevel["Debug"] = LoggerLevel["Debugging"] = 7] = "Debugging";

LoggerLevel[LoggerLevel["Perf"] = LoggerLevel["Performance"] = 6] = "Performance";
LoggerLevel[LoggerLevel["Timer"] = 5] = "Timer";

LoggerLevel[LoggerLevel["Info"] = LoggerLevel["Information"] = 4] = "Information";
LoggerLevel[LoggerLevel["Warn"] = LoggerLevel["Warning"] = 3] = "Warning";

LoggerLevel[LoggerLevel["Error"] = 2] = "Error";
LoggerLevel[LoggerLevel["Fatal"] = 1] = "Fatal";

// No output, completely silent
LoggerLevel[LoggerLevel["Silent"] = 0] = "Silent";

module.exports = LoggerLevel;