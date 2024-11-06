require('dotenv').config()
require('./db')
const express = require('express')
const http = require('http')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { bookCountLoader } = require('./dataloader')
const User = require('./models/user')

const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT || 4000

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})
useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServer.close()
          },
        }
      },
    },
  ],
})

const startServer = async () => {
  await server.start()

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req?.headers.authorization
        let currentUser = null

        if (auth?.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
          currentUser = await User.findById(decodedToken.id)
        }

        return { currentUser, bookCountLoader }
      },
    })
  )

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  )
}

startServer()
