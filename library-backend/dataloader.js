const DataLoader = require('dataloader')
const Book = require('./models/book')

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } })

  const bookCountByAuthor = authorIds.map(
    (id) =>
      books.filter((book) => book.author.toString() === id.toString()).length
  )

  return bookCountByAuthor
})

module.exports = { bookCountLoader }
