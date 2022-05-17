const express = require('express');
// import apollo and handlers
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
// connect to database
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const path = require('path');

const PORT = process.env.PORT || 3001;
// create new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create new instance of an Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// call the async function to start the server
startApolloServer(typeDefs, resolvers);