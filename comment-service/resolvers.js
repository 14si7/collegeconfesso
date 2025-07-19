// comment-service/resolvers.js
// This file contains the GraphQL resolvers for handling comments in the comment service.
const Comment = require('./models/Comment');
const axios = require('axios');
require('dotenv').config();

const resolvers = {
  Query: {
    comments: async (_, { confessionId }) => {
      console.log(`📥 Fetching comments for confession: ${confessionId}`);
      return await Comment.find({ confessionId }).sort({ createdAt: -1 });
    },
  },

  Mutation: {
    createComment: async (_, { confessionId, content }, { user }) => {
      if (!user) {
        console.warn('🚫 Comment creation attempted without authentication');
        throw new Error('Not authenticated');
      }

      const comment = await Comment.create({
        content,
        confessionId,
        userId: user.id,
      });

      console.log(`📝 Comment created by user ${user.id} on confession ${confessionId}`);
      return comment;
    },
  },

  Comment: {
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
        const user = response.data?.data?.user;
        if (user) {
          console.log(`👤 Fetched user info for comment: ${user.username} (${user.id})`);
        } else {
          console.warn(`⚠️ No user found for ID ${userId}`);
        }
        return user || null;
      } catch (error) {
        console.error('❌ User fetch error:', error.message);
        return null;
      }
    },
  },

  Confession: {
    comments: async ({ id }) => {
      console.log(`📥 Fetching comments for confession ID: ${id}`);
      return await Comment.find({ confessionId: id }).sort({ createdAt: -1 });
    },
  },
};

module.exports = resolvers;