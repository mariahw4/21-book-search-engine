// resolvers.js: Define the query and mutation functionality to work with the Mongoose models.
const { AuthenticationError } = require('apollo-server-express')
const { User, Book } = require('../models')
const { signToken } = require('../utils/auth');
const { sign } = require('jsonwebtoken');

// HINT
// Use the functionality in the user-controller.js as a guide.

const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user) {

                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('You need to be logged in!')
        }
    },

    Mutation: {
        // Create user
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return { token, user };

        },
        loginUser: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');

            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {

            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: {
                            // push to savedbooks array (input holds all of the book info)
                            savedBooks: bookData
                        }
                    },
                    {
                        new: true,
                        runValidators: true,
                    },
                );
                return user;
            }

            throw new AuthenticationError('You need to be logged in!')

        },

        // cant perform query's on a schema
        removeBook: async (parent, { bookId }, context) => {

            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },

                    { $pull: { savedBooks: { bookId } } },
                
                   {
                        new: true,
                        runValidators: true,
                    },

                );



                return user;
            }

            throw new AuthenticationError('You need to be logged in!')

        }

    }

}

module.exports = resolvers; 