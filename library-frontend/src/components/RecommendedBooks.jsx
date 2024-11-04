import { useQuery } from '@apollo/client'
import { ME, GET_BOOKS_BY_GENRE } from '../queries'

const RecommendedBooks = () => {
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME)

  const favoriteGenre = meData?.me?.favoriteGenre

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(GET_BOOKS_BY_GENRE, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre },
  })

  if (meLoading || booksLoading) {
    return <div>Loading...</div>
  }

  if (meError) {
    return <div>Error: {meError.message}</div>
  }

  if (booksError) {
    return <div>Error: {booksError.message}</div>
  }

  const books = booksData.allBooks

  return (
    <div>
      <h2>Recommended books</h2>
      <p>
        Favorite genre:{' '}
        <span style={{ fontWeight: 'bold' }}>{favoriteGenre}</span>
      </p>
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
    </div>
  )
}

export default RecommendedBooks
