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

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $birthYear: Int!) {
    editAuthor(name: $name, birthYear: $birthYear) {
      name
      birthYear
      id
    }
  }
`
