import { Link } from 'react-router-dom'

const NavigationMenu = ({ token, handleLogout }) => {
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
      {token ? (
        <>
          <Link to="/add-book" style={linkStyle}>
            Add book
          </Link>
          <Link to="/edit-author" style={linkStyle}>
            Edit author
          </Link>
          <Link to="/recommended-books" style={linkStyle}>
            Recommended books
          </Link>
          <Link to="/" onClick={handleLogout} style={linkStyle}>
            Log out
          </Link>
        </>
      ) : (
        <Link to="/login" style={linkStyle}>
          Log in
        </Link>
      )}
    </nav>
  )
}

export default NavigationMenu
