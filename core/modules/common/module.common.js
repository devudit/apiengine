/**
 * Define module class
 * variables available
 * name, description, routes, migrations
 */
class Common {
    constructor(){
        this.name = "Common";
        this.description = "Core common functionality";
        this.rootDir = __dirname;
        this.routes = "routes/routes.js";
        this.migrations = "migrations/migrations.js";
    }
}
module.exports = new Common;