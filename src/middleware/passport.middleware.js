import passport from "passport";

export function passportCall(strategy) {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
            if (error) return next(error);

            if (!user) {
                return res.status(401).json({
                    error: "Unauthorized",
                    details: info?.message || "Token inválido o expirado",
                });
            }
            console.log("Usuario autenticado por passport:", user)
            req.user = user;
            next();
        })(req, res, next);
    };
}
