const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()

  // Need to do this for the server to respond and the
  // newly created note to be rendered before starting to
  // create another note.
  await page.getByText(content).waitFor()
}

export { loginWith, createNote }
