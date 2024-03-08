

export const isSuperAdmin = async (req, res, next) => {

    try {
        if(req.tokenData.roleName !== 'super-admin'){
        return res.status(401).json(
            {
                success: false,
                message: "UNAUTHORIZED",
            }
        )
        }

     next();
     
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "YOU DONT HAVE PERMITIONS",
            }
        )
    }
}
