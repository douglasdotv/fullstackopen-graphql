import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../mutations'
import { GET_BOOKS } from '../queries'

const AddBookForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      navigate('/books')
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
