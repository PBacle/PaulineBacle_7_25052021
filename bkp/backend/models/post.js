const connection = require('../mysql-connection')


class Post {

    static getAll(callback){
        connection.execute(`SELECT p.*,
                                ( SELECT group_concat( c.userId) 
                                FROM comments c 
                                WHERE c.postId = p.id) as hasCommentedList, 
                                ( SELECT group_concat( l.userId) 
                                FROM likes l 
                                WHERE l.postId = p.id) as hasLikedList 
                                FROM posts p
                                ORDER BY creationDate DESC
                                `,callback)
    };

    static getAllByUSer(userId,callback){
        connection.execute(`SELECT p.*,
                                ( SELECT group_concat( c.userId) 
                                FROM comments c 
                                WHERE c.postId = p.id) as hasCommentedList, 
                                ( SELECT  group_concat( l.userId)
                                FROM likes l 
                                WHERE l.postId = p.id) as hasLikedList 
                            FROM posts p
                            WHERE p.userId = ?
                            ORDER BY creationDate DESC`, [userId],callback)
    };

    static getAllLikedByUSer(userId,callback){
        connection.execute(`SELECT p.*,
                                ( SELECT group_concat( c.userId) 
                                FROM comments c 
                                WHERE c.postId = p.id) as hasCommentedList, 
                                ( SELECT group_concat( l.userId) 
                                FROM likes l 
                                WHERE l.postId = p.id) as hasLikedList 
                            FROM likes l
                            INNER JOIN posts p ON l.postId = p.id   
                            WHERE l.userId = ?
                            ORDER BY creationDate DESC`,[userId], callback)
    };

    static getOne(id,callback){
        connection.execute(`SELECT p.*, u.firstname, u.lastname, u.pseudo
                            ( SELECT  group_concat( l.userId) 
                            FROM likes l 
                            WHERE l.postId = p.id) as hasLikedList 
                        FROM posts p
                        INNER JOIN users u ON u.id = p.userId   
                        WHERE p.id = ?`,[id], callback)
    };
    static createOne(userId, title, content, imgUrl, urlLink, callback){
        connection.execute(`INSERT INTO posts (userId, title, content, imgUrl, urlLink, creationdate) 
                                values (?, ?, ?, ?, now() );`,
                                [userId, title, content, imgUrl], urlLink, callback)
    };
 
    static updateOne( id, title, content, imgUrl, callback){
        connection.execute(`UPDATE posts
                            SET title = ?, content = ?, imgUrl = ?
                            WHERE id = ?`,[title, content, imgUrl, id], callback)
    };

    static deleteOne(id,callback){
        connection.execute(`DELETE FROM posts WHERE id = ?`,[id], callback)
    };
}
module.exports = Post;
