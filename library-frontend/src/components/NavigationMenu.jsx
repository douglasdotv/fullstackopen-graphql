import { Link } from 'react-router-dom'

const NavigationMenu = () => {
  const linkStyle = {
    marginRight: 10,
    textDecoration: 'none',
    color: 'blue',
  }

  return (
    <nav>
      <Link to="/books" style={linkStyle}>
        Books
      </Link>
      <Link to="/authors" style={linkStyle}>
        Authors
      </Link>
      <Link to="/add-book" style={linkStyle}>
        Add book
      </Link>
    </nav>
  )
}

export default NavigationMenu
