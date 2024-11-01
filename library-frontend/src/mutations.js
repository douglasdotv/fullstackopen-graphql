import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $publicationYear: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      publicationYear: $publicationYear
      genres: $genres
    ) {
      title
      author
      publicationYear
      id
    }
  }
`
