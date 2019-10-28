const sinon = require('sinon');
const expect = require('chai').expect;
const { Response, context } = require('../../mock');

describe('test register middleware functions', () => {

    const [validateRequest, Register, sendResponse] = require('../../../controllers/auth/register')(context);

    const req = {
        body: {
            email: 'someemail@gmail.com',
            name: 'John Doe',
            password: 'password'
        },
        login: (user, callback) => {
            req.user = user;
            callback(false);
        }
    };
    const res = new Response();
    const next = sinon.spy();

    sinon.spy(res, 'status');
    sinon.spy(res, 'json'); 

    beforeEach(done => {
        res.status.resetHistory();
        res.json.resetHistory();
        next.resetHistory();
        done();
    });

    describe('test validateRequest middleware', () => {

        beforeEach(done => {
            res.status.resetHistory();
            res.json.resetHistory();
            next.resetHistory();
            done();
        });

        it('should fail missing any one field of email, password, or name or have invalid values', done => {
            req.body.email = null;
            validateRequest(req, res, next);
            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.getCall(0).args[0]).to.deep.equal({ error: '"email" value is not valid' });

            req.body.email = 'someemail@gmail.com';
            delete req.body.password;
            validateRequest(req, res, next);
            expect(res.json.calledTwice).to.equal(true);
            expect(res.json.getCall(1).args[0]).to.deep.equal({ error: '"password" value not specified' });

            req.body.password = 'password';
            req.body.name = undefined;
            validateRequest(req, res, next);
            expect(res.json.calledThrice).to.equal(true);
            expect(res.json.getCall(2).args[0]).to.deep.equal({ error: '"name" value is not valid' });

            expect(res.status.alwaysCalledWith(400));
            expect(next.callCount).to.equal(0);
            done();
        });

        it('should return response of 400 if the email is not or password is too short', done => {
            req.body.email = 'notanemail.com';
            req.body.name = 'John Doe';
            validateRequest(req, res, next);
            expect(res.json.calledOnce).to.equal(true);
            expect(res.json.getCall(0).args[0]).to.deep.equal({ error: 'Invalid Email' });

            req.body.email = 'someemail@gmail.com';
            req.body.password = 'shortp';
            validateRequest(req, res, next);
            expect(res.json.calledTwice).to.equal(true);
            expect(res.json.getCall(1).args[0]).to.deep.equal({ error: 'Password length is too short, must be more than 8 characters' });
            
            expect(res.status.alwaysCalledWith(400)).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });

        it('should continue execution with valid parameters', done => {
            req.body.password = 'password';
            validateRequest(req, res, next);
            expect(next.calledOnce).to.equal(true);
            expect(res.status.notCalled).to.equal(true);
            expect(res.json.notCalled).to.equal(true);
            done();
        });
    });

    describe('test sendResponse middleware', () => {
        
        beforeEach(done => {
            res.status.resetHistory();
            res.json.resetHistory();
            next.resetHistory();
            done();
        });

        it('should return a response with status 500 if there is an error logging the user in', done => {
            req.body.error = 'I am an error';
            sendResponse(req, res, next);
            expect(res.status.calledOnceWith(500)).to.equal(true);
            expect(res.json.calledOnceWith({ error: 'I am an error' })).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });

        it('should return a response with status 200 if the user was logged in', done => {
            delete req.body.error;
            req.user = req.body;
            sendResponse(req, res, next);
            expect(res.status.calledOnceWith(200)).to.equal(true);
            expect(res.json.calledOnceWith({ username: 'someemail@gmail.com', name: 'John Doe' })).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });
    });
});