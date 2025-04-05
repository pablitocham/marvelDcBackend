import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../models/user.models.js";
import { CONFIG } from "../config/config.js";

const cookieExtractor = (req) => {
    const token = req?.cookies?.token || null;
    return token;
};

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: CONFIG.JWT_SECRET,
};

export const initializePassport = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                const user = await userModel.findById(payload.id);
                if (!user) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );
};

export const JWT_SECRET = CONFIG.JWT_SECRET;
export default initializePassport;
