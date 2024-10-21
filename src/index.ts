import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./graphql/schemas/schema";
import resolvers from "./graphql/resolvers/index";
import { findUserFromToken } from "./utils/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const user = await findUserFromToken(req.headers["authorization"] ?? "");

    return {
      req,
      user,
    };
  },
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
