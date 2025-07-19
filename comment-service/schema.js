// comment-service/schema.js
// This file defines the GraphQL schema for the comment service.
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define the Comment type
  type Comment {
    id: ID!
    content: String!
    user: User
    confessionId: String!
    createdAt: String!
  }

  # Reference the User type for federation
  type User @key(fields: "id") {
    id: ID!
    username: String!
  }

  # Extend the Confession type to add the comments field
  extend type Confession @key(fields: "id") {
    id: ID! @external
    comments(confessionId: String!): [Comment!]!
  }

  type Query {
    comments(confessionId: String!): [Comment!]!
  }

  type Mutation {
    createComment(confessionId: String!, content: String!): Comment!
  }
`;

module.exports = typeDefs;