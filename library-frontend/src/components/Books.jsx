import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_BOOKS, GET_BOOKS_BY_GENRE } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const { loading: allLoading, data: allData } = useQuery(GET_BOOKS, {
    skip: !!selectedGenre,
  })

  const {
    loading: genreLoading,
    data: genreData,
    refetch,
  } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })

  const books = selectedGenre ? genreData?.allBooks : allData?.allBooks || []

  const genres = Array.from(
    new Set((allData?.allBooks || []).flatMap((book) => book.genres))
  )

  const loading = selectedGenre ? genreLoading : allLoading

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre)
    if (genre) {
      refetch({ genre })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!books) {
    return <div>No books found</div>
  }

  return (
    <div>
      <h2>Books</h2>
      {selectedGenre && (
        <p>
          Selected genre:{' '}
          <span style={{ fontWeight: 'bold' }}>{selectedGenre}</span>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.publicationYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Filter by genre</h3>
        {genres.map((genre) => (
          <button key={genre} onClick={() => handleGenreSelect(genre)}>
            {genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase()}
          </button>
        ))}
        <button onClick={() => handleGenreSelect(null)}>All</button>
      </div>
    </div>
  )
}

export default Books
