const connection = require('../mysql-connection')

class User {
    static createOne(pseudo, firstname, lastname, email, password, callback){
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate) 
                                      VALUES (?, ?, ?, ?, ?, now());`,
        [pseudo,firstname, lastname, email, password], callback)
    };

    static findOne (email,callback, pseudo = '@'){
        connection.execute(`SELECT userId, pseudo, email, password, admin FROM users WHERE email = ? OR pseudo = ?`,[email,pseudo], callback)
    };

    static getOne (userId,callback){
        connection.execute(`SELECT userId, firstname, lastname, pseudo, email, bio, avatarUrl, registerDate FROM users WHERE userId = ?`,[userId], callback)
    };

    static updateOne (userId, pseudo, firstname, lastname,email, bio, avatarUrl, callback){
        connection.execute(`UPDATE users 
                            SET pseudo = ?, firstname = ?, lastname = ?, email = ?, bio = ?, avatarUrl = ?, registerDate = registerDate 
                            WHERE userId = ?;`,[pseudo, firstname, lastname, email, bio, avatarUrl, userId], callback)
    };

    static deleteOne (userId, callback){
        connection.execute(`DELETE FROM users WHERE userId = ?`,[userId], callback)
    };

    static createAdmin(pseudo, firstname, lastname, email, password, callback){
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate, admin) 
                                      VALUES (?, ?, ?, ?, ?, now(), 1)`,
        [pseudo,firstname, lastname, email , password], callback)
    };

    static findAdmin (callback){
        connection.execute(`SELECT userId, email FROM users WHERE admin = 1`, callback)
    };

}

module.exports = User;
