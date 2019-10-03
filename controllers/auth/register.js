
const setup = (passport) => {

    

    return [
        passport.authenticate('local-login'),
    ]
}