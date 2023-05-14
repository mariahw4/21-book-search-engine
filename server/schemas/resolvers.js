const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                // const userData = await User.findOne({_id: context.user.id })
                // .select('-__v -password');
                // return userData;
                return User.findOne({_id: context.user.id })
            }
            throw new AuthenticationError('Not Logged In')
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            console.log(args)
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: { savedBooks: bookData }},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You must be logged in.")
        },

        removeBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: {bookId: args.bookId}}},
                    {new: true}
                    );
                    return updatedUser;
            };
            throw new AuthenticationError("You must be logged in.")

        },

        loginUser: async (parent, { email, password }) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError("Incorrect Credentials")
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError("Incorrect Credentials")
            }

            const token = signToken(user);
            return { token, user };
        }
    },

};

module.exports = resolvers; 