require('./db')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const Author = require('./models/author')
const Book = require('./models/book')

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

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
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
  },
  Mutation: {
    addBook: async (_parent, args) => {
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
    },
    editAuthor: async (_parent, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.birthYear = args.birthYear

      return await author.save()
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
