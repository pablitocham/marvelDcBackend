import { Strategy as JwStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../models/user.models.js";
const JWT_SECRET = "claveSecreta";
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET
}

export const initializePassport = (passport) => {
    passport.use(new JwStrategy(opts, async (payload, done) => {
        try {
            const user = await userModel.findById(payload.id);
            if (!user) { return done(null, false); }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }))
}
export { JWT_SECRET }
export default initializePassport