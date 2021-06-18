module.exports = {
    checkLike : (likes,userId) => {
        userId = parseInt(userId, 10);
        var include = false;
        if(likes) {
            const users = likes.split(",") ;
            for(var i=0; i<users.length; i++) { users[i] = parseInt(users[i], 10); } 
            include =  users.includes(userId) ;
        }
        return include ;
      }  
}