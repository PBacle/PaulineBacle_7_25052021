const connection = require('../mysql-connection')

class User {
    static createOne(pseudo, firstname, lastname, email, password, callback){
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate) 
                                      VALUES (?, ?, ?, ?, ?, now());
                            SELECT * FROM users WHERE userId= LAST_INSERT_ID()`,
        [pseudo,firstname, lastname, email, password], callback)
    };

    static findOne (email,pseudo = '@',callback){
        connection.execute(`SELECT pseudo, email FROM users WHERE email = ? OR pseudo = ?`,[email,pseudo], callback)
    };

    static getOne (userId,callback){
        connection.execute(`SELECT * FROM users WHERE userId = ?`,[userId], callback)
    };

    static getAll (callback){
        connection.execute(`SELECT userId, pseudo, firstname, lastname FROM users`, callback)
    };

    static updateOne (userId, pseudo, firstname, lastname,bio='', avatarUrl='', callback){
        connection.execute(`UPDATE users 
                            SET pseudo = ?, firstname = ?, lastname = ?, bio = ?, avatarUrl = ? 
                            WHERE userId = ?;
                            SELECT * FROM users WHERE userId = ?`,[pseudo, firstname, lastname, bio, avatarUrl, userId, userId], callback)
    };

    static deleteOne (userId, callback){
        connection.execute(`DELETE FROM users WHERE userId = ?`,[id], callback)
    };

    static createAdmin(pseudo, firstname, lastname, email, password, callback){
        const cipherEmail = CryptoJS.AES.encrypt(email, config.security.cipher).toString();
        connection.execute(`INSERT INTO users (pseudo, firstname, lastname, email, password, registerDate, admin) 
                                      VALUES (?, ?, ?, ?, ?, now(), 1);
                            SELECT * FROM users WHERE userId= LAST_INSERT_ID()`,
        [pseudo,firstname, lastname, cipherEmail, password], callback)
    };

    static findAdmin (callback){
        connection.execute(`SELECT userId FROM users WHERE admin = 1`, callback)
    };

}
module.exports = User;





