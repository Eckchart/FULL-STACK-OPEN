const NoteForm = (props) => (
  <form onSubmit={props.onNoteSubmit}>
    <input value={props.newNote} onChange={props.onNoteChange} />
    <button type="submit">Save</button>
  </form>
)


export default NoteForm
