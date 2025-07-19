// user-service/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    user(id: ID!): User
  }

  type Mutation {
    register(username: String!, secretCode: String!): AuthPayload!
    login(username: String!, secretCode: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
