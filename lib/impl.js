var LoggerImpl = function() {}
LoggerImpl.prototype.log = function(level, scopes/*:string[]*/, messages/*:any[]*/) {
	throw new Error("Implementation missing `log`");
};
LoggerImpl.prototype.shouldAsync = function() {
	return true;
};

module.exports = LoggerImpl;