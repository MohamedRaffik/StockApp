const sinon = require('sinon');
const expect = require('chai').expect;
const { Response, context } = require('../../mock');

describe('test logout middleware functions', () => {

    const [isAuthenticated, Logout] = require('../../../controllers/auth/logout')(context);

    const req = {
        logout: () => {
            delete req.user;
        },
        user: {
            name: 'John Doe',
            email: 'someemail@gmail.com',
            password: 'password'
        }
    };
    const res = new Response();
    const next = sinon.spy();

    sinon.spy(res, 'status');
    sinon.spy(res, 'json'); 
    sinon.spy(res, 'end');

    beforeEach(done => {
        res.status.resetHistory();
        res.json.resetHistory();
        next.resetHistory();
        done();
    });

    it('should logout a user if they are logged in', done => {
        Logout(req, res, next);
        expect(req).to.not.have.property('user');
        expect(res.end.calledOnce).to.equal(true);
        done();
    });
});