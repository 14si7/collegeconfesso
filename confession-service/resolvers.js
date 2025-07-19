// confession-service/resolvers.js
// This file contains the GraphQL resolvers for the confession service
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Confession = require('./models/Confession');
require('dotenv').config();

const resolvers = {
  Query: {
    confessions: async () => await Confession.find(),
    confession: async (_, { id }) => await Confession.findById(id),
  },
  Mutation: {
    createConfession: async (_, { content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const confession = await Confession.create({
        content,
        userId: user.id,
      });
      return confession;
    },
    updateConfession: async (_, { id, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const confession = await Confession.findById(id);
      if (!confession) throw new Error('Confession not found');
      if (confession.userId !== user.id) throw new Error('Not authorized');
      confession.content = content;
      return await confession.save();
    },
    deleteConfession: async (_, { id }, { user }) => {
  console.log(`Attempting to delete confession with ID: ${id}`);

  // 🔐 Step 1: Require authentication
  if (!user) {
    console.error('❌ Not authenticated');
    throw new Error('Not authenticated');
  }

  try {
    const confession = await Confession.findById(id);
    if (!confession) {
      throw new Error('Confession not found');
    }

    // 🔒 Step 2: Ensure user owns the confession
    if (confession.userId !== user.id) {
      console.error(`❌ User ${user.id} not authorized to delete confession owned by ${confession.userId}`);
      throw new Error('Not authorized');
    }

    await confession.deleteOne();

    console.log(`✅ Confession deleted successfully by user ${user.id}: ${id}`);
    return true;
  } catch (err) {
    console.error('🔥 Error deleting confession:', err.message);
    throw new Error('Failed to delete confession');
  }
},
  },
  Confession: {
    user: async ({ userId }) => {
      try {
        const response = await axios.post(
          process.env.USER_SERVICE_URL,
          {
            query: `
              query GetUser($id: ID!) {
                user(id: $id) {
                  id
                  username
                }
              }
            `,
            variables: { id: userId },
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return response.data?.data?.user || null;
      } catch (error) {
        console.error('User service error:', error.message);
        return null;
      }
    },
  },
};

module.exports = resolvers;
