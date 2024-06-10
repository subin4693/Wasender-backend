const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    try {
        const testToken = req.cookies.token;
        console.log("token***************************");
        console.log(testToken);

        console.log("token***************************");

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
