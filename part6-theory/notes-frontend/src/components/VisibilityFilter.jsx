import { useNoteActions } from '../store'

const VisibilityFilter = () => {
  const { setFilter } = useNoteActions()

  return (
    <div>
      <input id="all" type="radio" name="filter" onChange={() => setFilter('all')} defaultChecked />
      <label htmlFor="all">all</label>

      <input id="important" type="radio" name="filter" onChange={() => setFilter('important')} />
      <label htmlFor="important">important</label>

      <input id="unimportant" type="radio" name="filter" onChange={() => setFilter('unimportant')} />
      <label htmlFor="unimportant">unimportant</label>
    </div>
  )
}

export default VisibilityFilter
