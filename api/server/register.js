import { read, write } from "../../src/apis/db.js"
import { chatsIndex, usersIndex } from "../../src/help/data.js"
import { User, Result } from "../../src/help/class.js"

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const { login, password } = req.body

  let indexUsers = JSON.parse(await read(usersIndex))
  if (Object.keys(indexUsers).includes(login)) {
    res.status(403).json({ ok: false, error: "Account already exists" })
  }
  const allowedSymbols = /^[a-z0-9_-*]+$/
  if (!allowedSymbols.test(login)) {
    res.status(400).json({ ok: false, error: "Unsupported symbols. Only use letters, numbers, _, - and * symbols", "supported": "a-z, A-Z, 0-9, _, -" })
  }
  if (login.length < 3 || login.length > 23) {
    res.status(400).json({ ok: false, error: "This username is too long! Only use usernames under 24 chars" })
  }
  const user = new User({ username: login, password, id: Object.keys(indexUsers).length + 2 })
  user.session = await new Session({ user: user.username }).token()
  indexUsers[login] = user.JSON

  res.status(200).json(new Result(true, { id: user.id }).result);
}
