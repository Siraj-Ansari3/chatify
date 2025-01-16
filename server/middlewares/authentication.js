const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        // console.log("tokenCookieValue: ", tokenCookieValue)
        if(!tokenCookieValue) {
            return next();
        }
        try {
        const userPayload = validateToken(tokenCookieValue);
        req.user = userPayload;
    } catch (error) {
        console.log("error: ", error )
    }
        return next();
    }
}

module.exports = {checkForAuthenticationCookie, }