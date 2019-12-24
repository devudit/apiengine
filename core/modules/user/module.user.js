/**
 * Define module class
 * variables available
 * name, description, routes, migrations
 */
class User {
    constructor(){
        this.name = "User";
        this.description = "Core user functionality";
        this.rootDir = __dirname;
        this.routes = "routes/routes.js";
        this.migrations = "migrations/migrations.js";
    }
}
module.exports = new User;