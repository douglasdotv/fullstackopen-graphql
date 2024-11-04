require('dotenv').config()
require('./db')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = process.env.JWT_SECRET

const typeDefs = `
  type Author {
    name: String!
    birthYear: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    publicationYear: Int!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      authorName: String!
      publicationYear: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!, 
      birthYear: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    authorCount: async () => Author.countDocuments(),
    bookCount: async () => Book.countDocuments(),
    allAuthors: async () => {
      return Author.find({})
    },
    allBooks: async (_parent, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },
    me: (_parent, _args, contextValue) => {
      return contextValue.currentUser
    },
  },
  Mutation: {
    addBook: async (_parent, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      try {
        let author = await Author.findOne({ name: args.authorName })

        if (!author) {
          author = new Author({ name: args.authorName })
          await author.save()
        }

        const book = new Book({
          title: args.title,
          publicationYear: args.publicationYear,
          genres: args.genres,
          author: author._id,
        })

        await book.save()

        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
    },
    editAuthor: async (_parent, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      try {
        const author = await Author.findOne({ name: args.name })

        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
            },
          })
        }

        author.birthYear = args.birthYear

        return await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        })
      }
    },
    createUser: async (_parent, args) => {
      try {
        const { username, favoriteGenre, password } = args

        if (password.length < 6) {
          throw new GraphQLError(
            'Password must be at least 6 characters long',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            }
          )
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
          username,
          favoriteGenre,
          passwordHash,
        })

        return await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    login: async (_parent, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      const isPasswordMatch =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash)

      if (!user || !isPasswordMatch) {
        throw new GraphQLError('Invalid username or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Author: {
    bookCount: async (parent) => {
      return Book.countDocuments({ author: parent._id })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req?.headers.authorization
    if (auth?.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    return {}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
