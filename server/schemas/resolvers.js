const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async () => {
            return User.find({});
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            return user;
        },
        createBook: async (parent, {user, body}) => {
            const book = await User.findOneAndUpdate(
                {_id: user._id},
                {new: true}
            );
            return book;
        },
        deleteBook: async (parent, user) => {
            const book = await User.findOneAndDelete(
            {_id: user._id},
                {new: true}
            );
            return book;
        },
    },

};

module.exports = resolvers; 