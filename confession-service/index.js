// confession-service/index.js
// This file sets up the Confession Service, a federated GraphQL microservice.
// It uses Express, Apollo Server, and Mongoose to connect to a MongoDB database.

// --- Core Dependencies ---
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Loads environment variables from a .env file

// --- Local Modules ---
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

/**
 * Asynchronously starts the Apollo server and connects to the database.
 */
async function startServer() {
  // --- Express App Initialization ---
  const app = express();

  // --- GraphQL Schema ---
  // Build a federated schema for the subgraph. This allows the service
  // to be part of a larger GraphQL gateway.
  const schema = buildSubgraphSchema({ typeDefs, resolvers });

  // --- Apollo Server Initialization ---
  const server = new ApolloServer({
    schema,
    // The context function is executed for every incoming GraphQL request.
    // It's used to pass data, like authentication info, to the resolvers.
    context: async ({ req }) => {
      // Extract the JWT from the authorization header.
      const token = req.headers.authorization || '';

      if (token) {
        try {
          // Verify the token using the secret key, removing the "Bearer " prefix.
          const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
          const { userId } = decoded;
          
          // Log successful authentication for debugging purposes.
          console.log(`🔑 Authenticated user: ${userId}`);
          
          // Return the user's ID in the context object.
          // Resolvers can now access this via `context.user`.
          return { user: { id: userId } };
        } catch (err) {
          // Handle cases where the token is expired or invalid.
          console.error('❌ Invalid token:', err.message);
        }
      } else {
        // Warn if a request is made without an authentication token.
        console.warn('⚠️ No token provided for a request.');
      }

      // Return an empty object if authentication fails.
      return {};
    },
  });

  // --- Server & Middleware ---
  await server.start();
  server.applyMiddleware({ app }); // Connects Apollo Server to the Express app.

  // --- Database Connection ---
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Confession Service connected to MongoDB');
  } catch (dbError) {
    console.error('❌ Failed to connect to MongoDB:', dbError);
    process.exit(1); // Exit if the database connection fails on startup.
  }

  // --- Start Listening ---
  const PORT = process.env.PORT || 4001; // Use a default port if not specified
  app.listen(PORT, () =>
    console.log(`🚀 Confession Service running at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

// --- Run the Server ---
startServer().catch(err => {
  console.error('💥 Server failed to start:', err);
});
