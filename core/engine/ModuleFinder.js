const fs = require('file-system');
const parser = require('annotation-parser');

module.exports = {
    init: async function () {

    },
    loadModules: function () {
        let modules = [];
        fs.recurse(rootDir+'/modules', [
            '**/module.*.js'
        ], function(filepath, relative, filename) {
            if (filename) {

                let _module = require(filepath);
                modules.push(_module);

            } else {
                // Do nothing
            }
        });

        return modules;
    }
};