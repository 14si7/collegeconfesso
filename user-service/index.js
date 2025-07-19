// user-service/index.js
// This file sets up the user service with Apollo Server, Mongoose, and JWT authentication.
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      if (token) {
        try {
          const { userId } = jwt.verify(token, process.env.JWT_SECRET);
          const user = await mongoose.model('User').findById(userId);
          return { user };
        } catch (error) {
          console.error('Invalid token:', error.message);
        }
      }
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB');

  app.listen(process.env.PORT, () =>
    console.log(`🚀 User Service running at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  );
}

startServer().catch(error => console.error('Server error:', error));