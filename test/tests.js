var assert = require('assert');
var child_process = require("child_process");
var path = require('path');

process.env.VERBOSE = 0xFF; // All possible verbosity levels
process.env.PROCESS_SEND_LOGGER = true;
process.env.LOGGER_NEVER_ASYNC = true;

var pkg;
var topDir = path.dirname(__dirname);
var supportDir = path.resolve(__dirname, "support");
var pkgfile = path.resolve(topDir, "package.json");
it('parse package.json', function(){
    pkg = require(pkgfile);
    if(!pkg)
        throw new Error("Failed to parse `package.json`");
    if(!("main" in pkg))
        throw new Error("`package.json` missing property `main`");
});
var logger;
it("require main", function() {
    logger = require(topDir);
});
describe('api', function() {
    it("test log", function(){
        logger.gears("Test");
        logger.info("Test");
        logger.warn("Test", 44);
        logger.error("Test", {farm: 43});
        logger.debug(/.+/i);
        logger.perf(new String(373.5));
        logger.error("");
		
		try {
			obviouslywontexist();
		} catch(e) {
			logger.fatal(e);
		}
    });
    var logInstance;
    it("scope instance", function(){
        logInstance = new logger("Mocha");
    });
    it("scope log", function(){
        logInstance.gears("Test");
        logInstance.info("Test");
        logInstance.info("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warn("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debug(/.+/i);
        logInstance.perf(new String(373.5));
        logInstance.error("");
        logInstance.fatal(new Error("Soupy monday"));
    });
});
