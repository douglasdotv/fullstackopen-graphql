import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../queries'

const Books = () => {
  const { loading, error, data } = useQuery(GET_BOOKS)

  const books = data?.allBooks || []

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h2>Books</h2>
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

export default Books
