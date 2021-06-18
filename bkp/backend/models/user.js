const connection = require('../mysql-connection')

class User {
    static createOne(pseudo, firstname, lastname, email, password, callback){
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate) 
                                      VALUES (?, ?, ?, ?, ?, now());`,
        [pseudo,firstname, lastname, email, password], callback)
    };
//                           SELECT * FROM users WHERE userId= LAST_INSERT_ID();`,

    static findOne (email,callback, pseudo = '@'){
        connection.execute(`SELECT userId, pseudo, email, password, admin FROM users WHERE email = ? OR pseudo = ?`,[email,pseudo], callback)
    };

    static getOne (userId,callback){
        connection.execute(`SELECT userId, firstname, lastname, pseudo, email, bio, avatarUrl, registerDate FROM users WHERE userId = ?`,[userId], callback)
    };

    static getAll (callback){
        connection.execute(`SELECT userId, pseudo, firstname, lastname FROM users`, callback)
    };

    static updateOne (userId, pseudo, firstname, lastname,bio='', avatarUrl='', callback){
        connection.execute(`UPDATE users 
                            SET pseudo = ?, firstname = ?, lastname = ?, bio = ?, avatarUrl = ? 
                            WHERE userId = ?;
                            SELECT userId, firstname, lastname, pseudo, email, bio, avatarUrl, registerDate
                            FROM users WHERE userId = ?`,[pseudo, firstname, lastname, bio, avatarUrl, userId, userId], callback)
    };

    static deleteOne (userId, callback){
        connection.execute(`DELETE FROM users WHERE userId = ?`,[id], callback)
    };

    static createAdmin(pseudo, firstname, lastname, email, password, callback){
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate, admin) 
                                      VALUES (?, ?, ?, ?, ?, now(), 1)`,
        [pseudo,firstname, lastname, email , password], callback)
    };

    static findAdmin (callback){
        connection.execute(`SELECT userId FROM users WHERE admin = 1`, callback)
    };

}
module.exports = User;




