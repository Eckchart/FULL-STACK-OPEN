const Filter = (props) => (
  <div>
    filter shown with <input value={props.filterText} onChange={props.onChange} />
  </div>
)

export default Filter;
