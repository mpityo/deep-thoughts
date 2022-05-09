const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        // parent is just a placeholder so we can access the second parameter
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        }
    }
};

module.exports = resolvers;