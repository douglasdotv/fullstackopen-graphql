import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../mutations'
import { GET_AUTHORS } from '../queries'
import Select from 'react-select'

const EditAuthorForm = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [birthYear, setBirthYear] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const { data } = useQuery(GET_AUTHORS)
  const authors = data?.allAuthors || []

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onCompleted: () => {
      navigate('/authors')
    },
    onError: (err) => {
      const graphQLErrors = err.graphQLErrors
      if (graphQLErrors?.length) {
        setError(graphQLErrors[0].message || 'Error updating author')
      } else {
        setError('An unknown error occurred')
      }
    },
  })

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!selectedAuthor) {
      setError('Please select an author')
      return
    }

    editAuthor({
      variables: {
        name: selectedAuthor.value,
        birthYear: parseInt(birthYear),
      },
    })
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">Author: </label>
          <Select
            id="author"
            options={authorOptions}
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            placeholder="Select an author..."
          />
        </div>
        <div>
          <label htmlFor="birthYear">New birth year: </label>
          <input
            id="birthYear"
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
      {error && <div style={{ color: 'red', margin: '10px' }}>{error}</div>}
    </div>
  )
}

export default EditAuthorForm
