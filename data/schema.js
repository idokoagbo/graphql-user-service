const { gql } = require('apollo-server-express');

const typeDefs = gql`
"A User entity"
type User {
    id: ID
    name: String!
    email: String!
    phone: String!
    country: String!
    createdAt: String!
    updatedAt: String!
    isVerified: Boolean!
    token: String
}

type Query {
    user: User!
    users: [User!]
}

type Mutation {
    signup (name: String!, email: String!, phone: String!, country: String! password: String!): User
    login (email: String!, password: String!): User,
    verify (email: String!, token: String!): User,
    resendEmail (email: String!, token: String!): User,
}
`;

module.exports = typeDefs;