import { useState } from 'react'

const AddBookForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log('Add book...')

    setTitle('')
    setPublicationYear('')
    setAuthor('')
    setGenres([])
    setGenre('')
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
          <button onClick={addGenre} type="button">
            +
          </button>
          <div>{genres.length > 0 && <p>Genres: {genres.join(', ')}</p>}</div>
        </div>
        <button type="submit">Add book</button>
      </form>
    </div>
  )
}

export default AddBookForm
