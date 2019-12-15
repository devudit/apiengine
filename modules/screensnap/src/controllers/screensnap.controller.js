// controllers/screensnap.controller.js
const pageres = require('pageres');
const uuidv3 = require('uuid/v3');

exports.screensnap = function (req, res) {
    // Set error to true
    let err = true;

    // Default image size.
    let size = ['1366x768', '1920x1080'];
    if(typeof req.body.size == "string"){
        size = [req.body.size];
    }

    // Url
    let url = req.query.url;
    if(!url){
        url = req.body.url
    }

    // Prepare image.
    if(typeof url == "string"){
        let url_id = null;

        try {
            // Prepare file name
            url_id = uuidv3(url, uuidv3.URL);

            // Prepare images
            new pageres({delay: 2})
                .src(url, size, {filename: url_id + '-<%= size %>'})
                .dest(publicImgDir)
                .run();
        } catch (e) {
            console.log(e.message)
        }

        if(url_id){
            err = false;
            res.json({status: 200, url_id: url_id, message: ''});
        }
    }

    // If there is some error.
    if(err == true){
        res.json({status: 500, message: 'There is some error, Please try later.'});
    }
};