// user-service/resolvers.js
// This file contains the resolvers for the GraphQL schema defined in user-service/graphql/schema.js
// It handles user registration, login, and fetching the current user.
// user-service/resolvers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
require('dotenv').config();

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    register: async (_, { username, secretCode }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error('Username already taken');

      const hashedCode = await bcrypt.hash(secretCode, 10);

      const user = await User.create({
        username,
        secretCode: hashedCode,
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return { token, user };
    },
    login: async (_, { username, secretCode }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('Invalid credentials');

      const isValid = await bcrypt.compare(secretCode, user.secretCode);
      if (!isValid) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return { token, user };
    },
  },
  User: {
    __resolveReference: async ({ id }) => {
      return await User.findById(id);
    },
  },
};

module.exports = resolvers;

