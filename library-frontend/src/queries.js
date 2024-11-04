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
      id
    }
  }
`
