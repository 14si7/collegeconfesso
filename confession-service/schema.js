// confession-service/schema.js
// This file defines the GraphQL schema for the confession service
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Confession {
    id: ID!
    content: String!
    user: User
    createdAt: String!
  }

  type User @key(fields: "id") {
    id: ID!
    username: String!
  }

  type Query {
    confessions: [Confession!]!
    confession(id: ID!): Confession
  }

  type Mutation {
    createConfession(content: String!): Confession!
    updateConfession(id: ID!, content: String!): Confession!
    deleteConfession(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;