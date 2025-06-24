const jwt = require("jsonwebtoken")

function setUser(user){
    return jwt.sign({
        fullname : user.fullname,
        role : user.role,
        _id : user._id
    },process.env.JWT_SECRET_KEY)
}


function getUser(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        console.log("Invalid token", err);
        return null;
    }
}


module.exports = {
    setUser,
    getUser
}