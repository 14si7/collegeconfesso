// gateway-service/index.js (unchanged)
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ quiet: true });

const app = express();
app.use(bodyParser.json());

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.token) {
      request.http.headers.set('authorization', context.token);
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'user-service', url: 'http://localhost:4001/graphql' },
      { name: 'confession-service', url: 'http://localhost:4002/graphql' },
      { name: 'comment-service', url: 'http://localhost:4003/graphql' },
    ],
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        user = { id: decoded.userId };
        console.log(`🔑 Gateway: Authenticated user ${user.id}`);
      } catch (err) {
        console.error('❌ Gateway: Invalid token:', err.message);
      }
    } else {
      console.warn('⚠️ Gateway: No token provided');
    }
    return { token, user };
  },
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      let user = null;
      if (token) {
        try {
          const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
          user = { id: decoded.userId };
        } catch (err) {
          console.error('❌ Gateway: Invalid token:', err.message);
        }
      }
      return { token, user };
    },
  });
  console.log(`🚀 Gateway Service running at ${url}`);
}

startServer().catch(err => {
  console.error('💥 Gateway failed to start:', err);
});