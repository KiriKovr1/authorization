import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import jwt from 'jsonwebtoken'

import cookieParser from 'cookie-parser'
import passport from 'passport'
import mongooseService from './services/mongoose.mjs'
import passportJWT from './services/passport.mjs'
import config from './config'
import Html from '../client/html'
import User from './model/User.model'

const { readFile } = require("fs").promises;


require('colors')

let Root

mongooseService.connect()


try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

passport.use('jwt', passportJWT.jwt)

middleware.forEach((it) => server.use(it))

const roomPath = `${__dirname}/rooms/rooms.json`

server.post('/api/v1/auth', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findAndValidateUser(req.body)

    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    delete user.password
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.json({ status: 'error', err })
  }
})

server.get('/api/v1/getRooms', async (req, res) => {
  const rooms = await readFile(roomPath, { encoding: "utf8" })
    .then(dataString => JSON.parse(dataString))
    .catch(err => console.log(err))
  res.json(rooms)
})


server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => { })

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
