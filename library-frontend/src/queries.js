import { gql } from '@apollo/client'

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      birthYear
      bookCount
      id
    }
  }
`

export const GET_BOOKS = gql`
  query {
    allBooks {
      title
      publicationYear
      author {
        name
      }
      genres
      id
    }
  }
`

export const GET_BOOKS_BY_GENRE = gql`
  query GetBooksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      publicationYear
      author {
        name
      }
      genres
      id
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`
