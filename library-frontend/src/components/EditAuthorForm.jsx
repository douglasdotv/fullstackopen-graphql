import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../mutations'
import { GET_AUTHORS } from '../queries'
import Select from 'react-select'

const EditAuthorForm = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [birthYear, setBirthYear] = useState('')

  const navigate = useNavigate()

  const { data } = useQuery(GET_AUTHORS)
  const authors = data?.allAuthors || []

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onCompleted: () => {
      navigate('/authors')
    },
  })

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedAuthor) {
      return
    }

    editAuthor({
      variables: {
        name: selectedAuthor.value,
        birthYear: parseInt(birthYear),
      },
    })

    setSelectedAuthor(null)
    setBirthYear('')
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
          <div>
            <label htmlFor="birthYear">New birth year: </label>
            <input
              id="birthYear"
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default EditAuthorForm
