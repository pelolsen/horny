const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")



function initialize(passport, getFromDB, getIDFromDB){
    const authenticateUser = async (email, password, done) => {
        let user;
        await getFromDB(email).then(email => user = email)
        //console.log("test 1", user)
        if (user.email == null) {
            return done(null, false, {message: "No user with that Email"})
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else{
                return done(null, false, {message: "Passwrod incorrect"})
            }
        }catch(error){
            return done(error)
        }
    } 
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done) => done(null, user.id))
    passport.deserializeUser(async (id,done) => {
       return done(null, await getIDFromDB(id).then(id=> user = id))
    })

}

module.exports = initialize;