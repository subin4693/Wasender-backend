const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    try {
        const testToken = req.cookies.token;
        console.log("middle ware function ********************************");
        console.log(req.cookies);
        console.log("middle ware function ********************************");

        let token;
        if (testToken && testToken.startsWith("bearer")) {
            token = testToken.split(" ")[1];
        }

        if (!token) {
            return res.status(200).json({
                status: "success",
                message: "You are not loggedin",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRECT);
        console.log("******************");
        console.log(decoded.id, decoded.role);
        console.log("******************");

        req.body.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.log(error);
        return res.json(400).send({ message: "User not authendicated" });
    }
};
