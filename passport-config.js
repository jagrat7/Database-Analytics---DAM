 const LocalStrategy = require('passport-local').Strategy
 const bcrypt = require('bcrypt');


function  initializePassport(passport,getUserByemail,getUserById){ 

    async function authenticateUser(email,password,done){
        const user = await getUserByemail(email)
        if(user==null){
            return done(null,false,{ message: 'No user with that email' })
        }
        // else{
        //     console.log(password + " user.pass : "+ user.password);
        //     console.log(user);

        // }   
        try {
            if(
                
                await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
            
        }

    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        return done(null, getUserById(id));
      });
}
module.exports= initializePassport