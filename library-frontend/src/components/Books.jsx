const Books = () => {
  const books = []

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
              <td>{book.author}</td>
              <td>{book.publicationYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
