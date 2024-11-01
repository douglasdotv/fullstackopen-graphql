import { useState } from 'react'
import NavigationMenu from './components/NavigationMenu'
import Books from './components/Books'
import Authors from './components/Authors'
import AddBookForm from './components/AddBookForm'

const App = () => {
  const [page, setPage] = useState('books')

  return (
    <div>
      <NavigationMenu setPage={setPage} />
      <Books show={page === 'books'} />
      <Authors show={page === 'authors'} />
      <AddBookForm show={page === 'add'} />
    </div>
  )
}

export default App
