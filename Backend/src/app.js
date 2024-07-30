import dotenv from 'dotenv'
import process from 'process'
import cors from 'cors'

import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import usersRouter from './routes/users.router.js'
import sessionsRouter from './routes/sessions.router.js'
import initializatePassport from './config/passportConfig.js'
import addLogger from './logger.js'

import __dirname from './utils/constantsUtil.js'

import { Server } from 'socket.io'
import websocket from './websocket.js'

dotenv.config()

const app = express()

// MongoDB connect
const uri = process.env.MONGO_URI
mongoose.connect(uri)

// Middlewares
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion de Ecommerce API',
      description: 'API de Ecommerce Coderhouse'
    }
  },
  apis: [`${__dirname}/../docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions)

app.use(addLogger)
app.use(express.json())
app.use(cors({ credentials: true, origin: 'https://proyecto-final-prog-backend-otero.vercel.app' }))
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(`${__dirname}/../../public`))
app.use(cookieParser())

initializatePassport()
app.use(passport.initialize())

// Routers
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const PORT = process.env.PORT || 8080
const httpServer = app.listen(PORT, () => { console.log(`Servidor activo en http://localhost:${PORT}`) })

const io = new Server(httpServer, {
  cors: {
    origin: 'https://proyecto-final-prog-backend-otero.vercel.app/',
    credentials: true,
    methods: ['GET', 'POST']
  }
})

websocket(io)
