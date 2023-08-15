var jwt = require('jsonwebtoken');
const jwt_secrete = "Malay@345@#$";
const fetchuser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using valid token" })
    }
    try {
        const data = jwt.verify(token, jwt_secrete);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token" })
    }

}
module.exports = fetchuser;