const fs = require('file-system');

module.exports = {
    init: async function () {

    },
    register: function () {
        var modules = [];
        if(app){
            fs.recurse(rootDir+'/modules', [
                '**/module.*.js'
            ], function(filepath, relative, filename) {
                if (filename) {
                    let _module = require(filepath);
                    modules.push(_module);

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