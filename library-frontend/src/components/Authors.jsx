import { useQuery } from '@apollo/client'
import { GET_AUTHORS } from '../queries'

const Authors = () => {
  const { loading, error, data } = useQuery(GET_AUTHORS)

  const authors = data?.allAuthors || []

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Author</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.birthYear || '-'}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
