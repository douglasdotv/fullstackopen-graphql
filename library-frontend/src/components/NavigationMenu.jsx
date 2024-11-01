const NavigationMenu = (props) => {
  const linkStyle = {
    marginRight: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'blue',
  }

  return (
    <nav>
      <a
        href="#"
        style={linkStyle}
        role="button"
        onClick={(e) => {
          e.preventDefault()
          props.setPage('books')
        }}
      >
        Books
      </a>
      <a
        href="#"
        style={linkStyle}
        role="button"
        onClick={(e) => {
          e.preventDefault()
          props.setPage('authors')
        }}
      >
        Authors
      </a>
      <a
        href="#"
        style={linkStyle}
        role="button"
        onClick={(e) => {
          e.preventDefault()
          props.setPage('add')
        }}
      >
        Add book
      </a>
    </nav>
  )
}

export default NavigationMenu
