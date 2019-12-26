// controllers/user.controller.js
exports.userRegister = function (req, res) {
    if(req.body.name && req.body.mail && req.body.pass){
        try{
            mysql.user.userExist(req.body.name,req.body.mail).then(function(exist){
                if(exist){
                    res.status(401).send("User already exist").end(); 
                } else{
                    //Create user object
                    const user = { 
                        name: req.body.name, 
                        pass: req.body.pass,
                        mail: req.body.mail,
                        full_name: req.body.full_name
                    };

                    mysql.user.createUser(user).then(function(value){
                        res.status(200).send("User created.").end()
                    });
                }
            });
        } catch(error){
            res.status(400).send("There is some error try later.").end();
        }
    } else{
        res.status(400).send("Username, Email & Password are required.").end();
    }
};
exports.userLogin = function(req, res){
    if((req.body.name || req.body.mail) && req.body.pass){
        let user= {
            pass: req.body.pass
        };
        if(req.body.name){
            user.name = req.body.name
        }
        if(req.body.mail){
            user.mail = req.body.mail
        }
        mysql.user.loginUser(user).then(function(user){
            res.json(user)
        })
    }
}