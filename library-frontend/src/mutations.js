import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $authorName: String!
    $publicationYear: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      authorName: $authorName
      publicationYear: $publicationYear
      genres: $genres
    ) {
      title
      author {
        name
        birthYear
      }
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

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
