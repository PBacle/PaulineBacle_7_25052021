const connection = require('../mysql-connection')

class Comment {
    static getAll(postId, callback){
        connection.execute(`SELECT * FROM comments WHERE postId = ?`, [postId], callback)
    };

    static createOne(postId, userId, content, callback){
        connection.execute(`INSERT INTO comments (userId, postId, content, creationDate) values (?, ?, ?, now())`,
        [postId, userId, content], callback)
    };

    static deleteOne(id,callback){
        connection.execute(`DELETE FROM comments WHERE id = ?`,[id], callback)
    };

/*    static updateOne(id, content, callback){
        connection.execute(`UPDATE comments SET content = ? WHERE id = ?`,[content, id], callback)
    };*/

    static getOne(id,callback){
        connection.execute(`SELECT * FROM comments WHERE id = ?`,[id], callback)
    };

    static checkLike(postId, userId,callback){
        connection.execute(`SELECT * FROM likes WHERE postId = ? AND userId = ?`,[postId, userId], callback)
    };

    static likePost(postId,userId, callback){
        connection.execute(`INSERT INTO likes (postId, userId) values (?, ?)`,[postId,userId], callback)
    };

    static dislikePost(postId, userId,callback){
        connection.execute(`DELETE FROM likes WHERE postId = ? AND userId = ?`,[postId, userId], callback)
    };

}
module.exports = Comment;
