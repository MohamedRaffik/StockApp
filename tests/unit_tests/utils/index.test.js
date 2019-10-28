const sinon = require('sinon');
const expect = require('chai').expect;
const { Response } = require('../../mock');

describe('test functions of the utils folder', () => {
    
    describe('test validate email function', () => {
        const { validateEmail } = require('../../../controllers/utils');

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
        const { isAuthenticated } = require('../../../controllers/utils');
        const req = {};
        const res = new Response();

        sinon.spy(res, 'status');
        sinon.spy(res, 'json'); 

        it('should set response to 401 and return an error json if a user object is not in the request object', (done) => {
            isAuthenticated(req, res, null);
            expect(res.status.calledOnceWith(401));
            expect(res.json.calledOnce);
            expect(res.json.getCall(0).args[0]).to.have.property('error');
            done();
        });

        it('should continue execution if a user object is in the request object', (done) => {
            req.user = {};
            const spy = sinon.spy();
            isAuthenticated(req, res, spy);
            expect(spy.called);
            done();
        });
    });

    describe('test validateFields function', () => {
        const { validateFields } = require('../../../controllers/utils');

        it('should return a string specifying the field missing', done => {
            const test = {};
            expect(validateFields(test, ['body'])).to.equal('"body" value not specified', 'check single field');
            test.body = [];
            expect(validateFields(test, ['body', 'top'])).to.equal('"top" value not specified', 'check multiple fields');
            done();
        });

        it('should return a string specifying the field is not valid if it is null or undefined', done => {
            const test = { body: null };
            expect(validateFields(test, ['body'])).to.equal('"body" value is not valid', 'null value');
            test.body = undefined;
            expect(validateFields(test, ['body'])).to.equal('"body" value is not valid', 'undefined value');
            done();
        });

        it('should return false if all fields are in the object and are valid values', done => {
            const test = { body: [], top: [] };
            expect(validateFields(test, ['body', 'top'])).to.equal(false);
            done();
        });
    });
});

