import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useApolloClient } from '@apollo/client'
import { ADD_BOOK } from '../mutations'
import { GET_BOOKS, GET_BOOKS_BY_GENRE } from '../queries'

const AddBookForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const client = useApolloClient()

  const [createBook] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      navigate('/books')
      client.refetchQueries({ include: [GET_BOOKS] })
    },
    onError: (err) => {
      const graphQLErrors = err.graphQLErrors
      if (graphQLErrors?.length) {
        const details = graphQLErrors[0].extensions?.error?.errors
        if (details) {
          const validationMessages = Object.values(details)
            .map((detail) => detail.message)
            .join('. ')
          setError(validationMessages || 'Validation error')
        } else {
          setError(graphQLErrors[0].message)
        }
      } else {
        setError('An unknown error occurred')
      }
    },
    update: (cache, { data: { addBook } }) =>
      updateCacheWithNewBook(cache, addBook),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    createBook({
      variables: {
        title,
        authorName: author,
        publicationYear: parseInt(publicationYear),
        genres,
      },
    })
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const updateCacheWithNewBook = (cache, addBook) => {
    if (addBook.genres) {
      addBook.genres.forEach((genre) => {
        updateBooksByGenre(cache, genre, addBook)
      })
    }
  }

  const updateBooksByGenre = (cache, genre, addBook) => {
    cache.updateQuery(
      { query: GET_BOOKS_BY_GENRE, variables: { genre } },
      (oldData) => {
        return getUpdatedBooks(oldData, addBook)
      }
    )
  }

  const getUpdatedBooks = (oldData, addBook) => {
    if (!oldData) {
      return { allBooks: [addBook] }
    }

    const bookExists = oldData.allBooks.some((book) => book.id === addBook.id)

    return {
      ...oldData,
      allBooks: bookExists ? oldData.allBooks : [...oldData.allBooks, addBook],
    }
  }

  return (
    <div>
      <h2>Add book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author: </label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="publicationYear">Publication year: </label>
          <input
            id="publicationYear"
            type="number"
            value={publicationYear}
            onChange={({ target }) => setPublicationYear(target.value)}
          />
        </div>
        <div>
          <label htmlFor="genre">Genre: </label>
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button type="button" onClick={addGenre}>
            Add genre
          </button>
        </div>
        {genres.length > 0 && <p>Genres: {genres.join(', ')}</p>}
        <button type="submit">Add book</button>
      </form>
      {error && <div style={{ color: 'red', margin: '10px' }}>{error}</div>}
    </div>
  )
}

export default AddBookForm
