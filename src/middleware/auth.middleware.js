export function authorize(...roles) {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
export const authMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
};