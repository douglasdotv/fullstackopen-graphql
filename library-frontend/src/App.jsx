import { Routes, Route } from 'react-router-dom'
import NavigationMenu from './components/NavigationMenu'
import Books from './components/Books'
import Authors from './components/Authors'
import AddBookForm from './components/AddBookForm'

const App = () => {
  return (
    <div>
      <NavigationMenu />
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/add-book" element={<AddBookForm />} />
        <Route path="*" element={<Books />} />
      </Routes>
    </div>
  )
}

export default App
