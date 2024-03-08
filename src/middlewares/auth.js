
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1]

    try {

        if (!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: "UNAUTHORIZED",
                }
            )
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.tokenData = decoded

        next()
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "JWT NOT VALID OR MALFORMED",
            }
        )
    }
}

