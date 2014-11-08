var assert = require('assert');
var child_process = require("child_process");
var path = require('path');

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
it("require main", function(){
    logger = require(topDir);
});
describe('api', function() {
    it("test log", function(){
        logger.gears("Test");
        logger.info("Test");
        logger.warn("Test");
        logger.error("Test");
    });
});
