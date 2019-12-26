const fs = require('file-system');

module.exports = {
    init: async function () {

    },
    register: function () {
        var modules = [];
        if(app){
            // Register core modules
            let core_modules = this._register(rootDir+'/core/modules');
            // Register contributed modules
            let contrib_modules = this._register(rootDir+'/modules');

            modules.push(core_modules);
            modules.push(contrib_modules);
        }
        return modules;
    },
    _register: function(dir){
        var modules = [];
        if(dir){
            fs.recurse(dir, [
                '**/module.*.js'
            ], function(filepath, relative, filename) {
                if (filename) {
                    let _module = require(filepath);
                    modules.push(_module);

                    // Register Models
                    let models = _module.rootDir+'/src/'+_module.models;
                    if(fs.fs.existsSync(models)){
                        let _key = utils.toCamelCase(_module.name);
                        
                        mysql[_key] = require(models);
                    }

                    // Register Module routes
                    let routes = _module.rootDir+'/src/'+_module.routes;
                    if(fs.fs.existsSync(routes)){
                        app.use(require(routes));
                    }
                } else {
                    // Do nothing
                }
            });
        }
        return modules;
    }
};