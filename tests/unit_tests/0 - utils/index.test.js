const { context, Request, Response } = require('../../mock_context');
const { utils } = context;
const expect = require('chai').expect;

describe('test functions of the utils folder', () => {
    
    describe('test validate email function', () => {

        const { validateEmail } = utils;
      
        it('should fail when email does not have @ symbol', (done) => {
            expect(validateEmail('someemail.com')).to.be.false;
            done();
        });

        it('should pass with a valid email', (done) => {
            expect(validateEmail('someemail@google.com')).to.be.true;
            done();
        });
    });

    describe('test isAuthenticated middleware function', () => {

        const { isAuthenticated } = utils;

        const req = new Request();
        const res = new Response();

        it('should set response to 401 and return an error json if a user object is not in the request object', (done) => {
            isAuthenticated(req, res, null);
            expect(res.statusCode).to.equal(401);
            expect(res.jsonData).to.deep.equal({error: 'Unauthorized'});
            done();
        });

        it('should continue execution if a user object is in the request object', (done) => {
            req.user = {};
            isAuthenticated(req, res, () => {
                done();
            });
            throw Error('callback function was not executed');
        });
    });
});

