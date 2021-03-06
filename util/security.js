const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const hash = require("./hash.js").digest;
const users = require('../model/users');
const tool = require('../util/tool');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use("local-strategy", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, (req, username, password, done) => {

    async function main() {
        const retObj = await users.findPKeyActive(username,tool.getYYYYMMDD(new Date()));
        if (!retObj) {
            done(null, false, req.flash("msg", "ユーザー名　または　パスワード　が間違っています。"));
        } else {
            if (retObj.length === 0) {
                done(null, false, req.flash("msg", "ユーザー名　または　パスワード　が間違っています。"));
            } else {
                if (retObj[0].password === hash(password)) {
                    req.session.regenerate((err) => {
                        if (err) {
                            done(err);
                        } else {
                            done(null, retObj[0]);
                        }
                    });
                } else {
                    done(null, false, req.flash("msg", "ユーザー名　または　パスワード　が間違っています。"));
                }
            }
        }
    }
    main();

}));

const initialize = function () {
    return [
        passport.initialize(),
        passport.session(),
        function (req, res, next) {
            if (req.user) {
                res.locals.user = req.user;
            }
            next();
        }
    ];
};

const authenticate = function () {
    return passport.authenticate(
        "local-strategy", {
        successRedirect: "/",
        failureRedirect: "/login"
        }
    );
};

const authorize = function () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    };
};

module.exports = {
    initialize,
    authenticate,
    authorize,
};