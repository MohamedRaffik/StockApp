const { context, Request, Response } = require('../../mock_context');
const expect = require('chai').expect;

describe('test register controller', () => {
    
    const functions = require('../../../controllers/auth/register')(context);
    const [validateBody, validateRequest, Register, sendResponse] = functions;

    describe('test validateBody function', () => {

        const req = new Request();
        const res = new Response();

        it('should return a 400 response missing the email field and return an error json', (done) => {
            req.body = {};
            validateBody(req, res);
            expect(res.statusCode).to.equal(400);
            expect(res.jsonData).to.have.property('error');
            done();
        });

        it('should return a 400 response missing the password field and return an error json', (done) => {
            req.body.email = 'someemail@gmail.com'
            validateBody(req, res);
            expect(res.statusCode).to.equal(400);
            expect(res.jsonData).to.have.property('error');
            done();
        });

        it('should return a 400 response missing the name field and return an error json', (done) => {
            req.body.name = 'John Doe';
            validateBody(req, res);
            expect(res.statusCode).to.equal(400);
            expect(res.jsonData).to.have.property('error');
            done();
        });

        it('should invoke the next function with all valid fields', (done) => {
            req.body.password = 'password';
            validateBody(req, res, () => {
                done();
            });
        });
    });

    describe('test validateRequest function', () => {

        const req = new Request();
        const res = new Response();

        it('should return a 400 response with password length error', (done) => {
            req.body = {
                email: 'someemail@google.com',
                password: '1234567'
            };
            validateRequest(req, res);
            expect(res.statusCode).to.equal(400);
            expect(res.jsonData).to.have.property('error');
            done();
        });
    });

    describe('test Register function', () => {

        let req = new Request();
        let res = new Response();

        beforeEach((done) => {
            req = new Request();
            req.body = { 
                name:  'John Doe',
                email: 'someemail@google.com',
                password: 'password'
            };
            res = new Response();
            done();
        });

        it('should create an account in the database', (done) => {
            Register(req, res, () => {
                expect(req.body).not.have.property('error');
                expect(req).to.have.property('user');
                expect(req.user.email).to.equal(req.body.email);
                done();
            });
        });

        it('should return an error response if the account with that email exists', (done) => {
            Register(req, res, () => {
                expect(req.body).to.have.property('error');
                done();
            });
        });
    });

    describe('test sendResponse function', () => {

    });
});
