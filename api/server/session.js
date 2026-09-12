import { read } from "../../src/apis/db.js"
import { chatsIndex, usersIndex } from "../../src/help/data.js"
import { User, Result } from "../../src/help/class.js"

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const { login, session } = req.body

  let indexUsers = JSON.parse(await read(usersIndex))
  if (!Object.keys(indexUsers).includes(login)) {
    res.status(403).json({ ok: false, error: "Account doesnt exist
      " })
  }
  const user = new User(indexUsers[login])
  if (user.session !== session) {
    res.status(403).json({ ok: false, error: "Invalid token" })
  }
  const isActual = await user.checkToken()
  if (!checkActual) {
    res.status(403).json({ ok: false, error: "Outdated token" })
  }
  const userJSON = user.JSON

  res.status(200).json(new Result(true, {
    result: {
      name: userJSON.name,
      username: userJSON.username,
      id: userJSON.id
    }
  }).result);
}
