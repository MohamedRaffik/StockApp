const sinon = require('sinon');
const expect = require('chai').expect;
const { Response, context } = require('../../mock');

describe('test login middleware functions', () => {

    const [checkIfLoggedIn, validateRequest, Login, sendResponse] = require('../../../controllers/auth/login')(context);

    const req = {
        body: {
            email: 'someemail@gmail.com',
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

    describe('test checkIfLoggedIn middleware', () => {

        beforeEach(done => {
            res.status.resetHistory();
            res.json.resetHistory();
            next.resetHistory();
            done();
        });

        it('should return if the user is already logged in', done => {
            req.user = { email: 'someemail@gmail.com', name: 'John Doe' };
            checkIfLoggedIn(req, res, next);
            expect(res.status.calledOnceWith(200)).to.equal(true);
            expect(res.json.calledOnceWith({ username: 'someemail@gmail.com', name: 'John Doe' })).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });

        it('should continue execution if there is no user logged in', done => {
            delete req.user;
            checkIfLoggedIn(req, res, next);
            expect(next.calledOnce).to.equal(true);
            expect(res.status.notCalled).to.equal(true);
            expect(res.json.notCalled).to.equal(true);
            done();
        })
    });

    describe('test validateRequest middleware', () => {
        
        beforeEach(done => {
            res.status.resetHistory();
            res.json.resetHistory();
            next.resetHistory();
            done();
        });

        it('should return response of 400 if the email field is missing or invalid', done => {
            delete req.body.email;
            validateRequest(req, res, next);
            expect(res.json.getCall(0).args[0]).to.deep.equal({ error: '"email" value not specified' })

            req.body.email = 'someemail.com';
            validateRequest(req, res, next);
            expect(res.json.getCall(1).args[0]).to.deep.equal({ error: 'Invalid email' });

            expect(res.status.alwaysCalledWith(400)).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });

        it('should continue execution with valid email', done => {
            req.body.email = 'someemail@gmail.com';
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

        it('should return a 500 response if the user was not able to be logged in', done => {
            req.body.error = 'I am an error';
            sendResponse(req, res, next);
            expect(res.status.calledOnceWith(500)).to.equal(true);
            expect(res.json.calledOnceWith({ error: 'I am an error' })).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });

        it('should return a 200 response if the user was successfully logged in', done => {
            delete req.body.error;
            req.user = { ...req.body, name: 'John Doe' };
            sendResponse(req, res, next);
            expect(res.status.calledOnceWith(200)).to.equal(true);
            expect(res.json.calledOnceWith({ username: 'someemail@gmail.com', name: 'John Doe' })).to.equal(true);
            expect(next.notCalled).to.equal(true);
            done();
        });
    });
});
