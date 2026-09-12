import { genHash, checkHash } from "./hash.js"

class User {
  constructor (json) {
    this.username = json.username || `id${json.id || null}`
    this.password = json.password || ""
    this.id = json.id || null
    this.session = json.session || new Session({ user: json.username })
    this.chats = json.chats || []
    this.role = json.role || "user"
    this.joined = json.joined || String(new Date())
    this.active = json.active || String(new Date())
    this.name = json.name || ""
    this.devices = Array(json.devices || [])
    this.warns = Array(json.warns || [])
    this.notifications = Array(json.notifications || [])
    this.settings = json.settings || new UserSettings()
  }
  async setToken() {
    this.session = await this.session.token()
  }
  async checkSession() {
    return await this.session.check()
  }
  get JSON () {
    return {
      username: this.username,
      password: this.password,
      id: this.id,
      session: this.session,
      chats: this.chats,
      role: this.role,
      joined: this.joined,
      active: this.active,
      name: this.name,
      devices: this.devices,
      warns: this.warns,
      notifications: this.notifications,
      settings: this.settings.JSON()
    }
  }
  newActive () {
    this.active = String(new Date())
  }
  toString() {
    return `User(${this.username})`
  }
}
class Chat {
  constructor (json) {
    this.name = json.name || "Error occured"
    this.username = json.username || "Error occured"
    this.id = json.id || null
    this.type = json.type || "group"
    this.members = json.members || []
    this.isE2EE = json.isE2EE || true
    this.accessType = json.accessType || "private"
    this.admins = json.admins || []
    this.messages = json.messages || []
    this.e2ee = json.e2ee || {}
  }
  get JSON () {
    return {
      name: this.name,
      username: this.username,
      id: this.id,
      type: this.type,
      members: this.members,
      isE2EE: this.isE2EE,
      accessType: this.accessType,
      admins: this.admins,
      messages: this.messages,
      e2ee: this.e2ee
    }
  }
  sendMessage (data) {
    const message = new Message(data)
    this.messages.push(message.JSON)
  }
  newMember (username) {
    this.members.push(username)
  }
}
class Result {
  constructor (ok, other) {
    this.result = {
      ok,
      ...other
    }
  }
}
class Session {
  constructor (data) {
    this.date = data?.date || new Date()
    this.user = data?.user || "Error occured"
    this.active = data?.active || 7 * 24 * 60 * 60
    this.org = "DCG"
  }
  get Export () {
    return {
      date: this.date,
      user: this.user,
      active: this.active
    }
  }
  async token () {
    return await genHash(this)
  }
  async check () {
    return await checkHash(this)
  }
  toString () {
    return `ScratchssengerSession(${this.user})`
  }
}
class Message {
  constructor (data) {
    this.author = data.author || "Error occured"
    this.text = data.text || "Error occured"
    this.date = data.date || new Date()
    this.id = data.id || 0
  }
  get JSON () {
    return {
      author: this.author,
      text: this.text,
      date: this.date,
      id: this.id
    }
  }
}

class UserSettings {
  constructor (json) {
    this.chats = json.chats || {
      notifications: {}
    }
    this.theme = json.theme || 'light'
  }

  JSON () {
    return {
      chats: this.chats,
      theme: this.theme
    }
  }
}

export { User, Chat, Result, Session, Message, UserSettings }
