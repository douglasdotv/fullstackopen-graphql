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
