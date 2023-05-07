const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: 
    authors: [Strings!]
    description: 
    title: 
    image: 
    link: 
  }

  type Auth {
    token: String!
    user: [User]
  }

  type Query {
    me: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(): 
    removeBook():

  }
`;

module.exports = typeDefs;
