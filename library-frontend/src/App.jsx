import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
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
