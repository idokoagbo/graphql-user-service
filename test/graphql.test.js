const chai = require('chai');
const expect = chai.expect;

const url = `http://localhost:${process.env.port || process.env.PORT}`
const request = require('supertest')(url);


describe('Graphql', () => {
    it('Returns users', (done) => {
        request.post('/graphql').send({
            query: `{
                users {
                    id
                    name,
                    email
                    phone
                }
            }`
        }).expect(200).end((error, response) => {
            // response should contain array with users

            if (error) {
                return done(error);
            }

            expect(response.body.data.users).to.have.lengthOf.at.least(0);

            if (response.body.data.users.length > 0) {
                expect(response.body.data.users[0]).to.have.property('id');
                expect(response.body.data.users[0]).to.have.property('name');
                expect(response.body.data.users[0]).to.have.property('email');
                expect(response.body.data.users[0]).to.have.property('phone');
            }
            
            done();
        })
    });

    it('Creates new user', (done) => {
        request.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                query: `mutation {
                signup(name: "Test User", email:"testuser@example.com", phone: "2348012345678", country: "Nigeria", password: "password"){
                    id
                }
            }`
            }).expect(200).end((error, response) => {

                if (error) {
                    return done(error);
                }

                expect(response.body.data.signup).to.have.property('id');

                done();

            });
    });

    it('Does not login unverified user', (done) => {
        request.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                query: `mutation {
                login(email: "testuser@example.com", password: "password"){
                    token
                }
            }`
            }).expect(200).end((error, response) => {

                if (error) {
                    return done(error);
                }

                expect(response.body.errors).to.have.length.of.at.least(1);
                expect(response.body.errors[0].message).to.equal('Unverified User');
                done();
            })
    })
})