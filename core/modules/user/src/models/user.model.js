const bcrypt = require('bcrypt');

module.exports = {
    userNameExist: async function(username){
        if(username){
            result = await mysql.getOneRow('users',{name:username});
            if(result){
                return true;
            }
        }
        return false;
    },
    userMailExist: async function(mail){
        if(mail){
            result = await mysql.getOneRow('users',{mail:mail})
            if(result){
                return true;
            }
        }
        return false;
    },
    userExist: async function(name,mail){
        return Promise.all([
            this.userNameExist(name),
            this.userMailExist(mail)
        ]).then(function(values){
            if(values[0] || values[1]){
                return true;
            } else {
                return false;
            }
        });
    },
    createUser: function(user){
        // Todo: Add bcrypt back
        // user.pass = await bcrypt.hash(user.pass, 30);
        return mysql.insertRow('users',user);
    },
    loginUser: async function(user){
        result = await mysql.getOneRow('users',user);
        return result;
    }
};