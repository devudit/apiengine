/**
 * Define module class
 * variables available
 * name, description, routes, migrations
 */
class ScreenSnap {
    constructor(){
        this.name = "ScreenSnap";
        this.description = "Take snapshot of website";
        this.routes = "routes/routes.js";
        this.migrations = "migrations/migrations.js";
    }
}
module.exports = ScreenSnap;