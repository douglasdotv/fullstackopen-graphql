import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './subscriptions'
import { GET_BOOKS } from './queries'
import NavigationMenu from './components/NavigationMenu'
import Books from './components/Books'
import Authors from './components/Authors'
import AddBookForm from './components/AddBookForm'
import EditAuthorForm from './components/EditAuthorForm'
import LoginForm from './components/LoginForm'
import RecommendedBooks from './components/RecommendedBooks'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded
      alert(`New book added: ${newBook.title} by ${newBook.author.name}`)

      client.cache.updateQuery({ query: GET_BOOKS }, (oldData) => {
        if (!oldData) {
          return { allBooks: [newBook] }
        }

        const isAlreadyAdded = oldData.allBooks.some(
          (book) => book.id === newBook.id
        )

        return {
          allBooks: isAlreadyAdded
            ? oldData.allBooks
            : oldData.allBooks.concat(newBook),
        }
      })
    },
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <NavigationMenu token={token} handleLogout={handleLogout} />
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        {token ? (
          <>
            <Route path="/add-book" element={<AddBookForm />} />
            <Route path="/edit-author" element={<EditAuthorForm />} />
            <Route path="/recommended-books" element={<RecommendedBooks />} />
            <Route path="/login" element={<Navigate replace to="/books" />} />
          </>
        ) : (
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
        )}
        <Route path="*" element={<Books />} />
      </Routes>
    </div>
  )
}

export default App
