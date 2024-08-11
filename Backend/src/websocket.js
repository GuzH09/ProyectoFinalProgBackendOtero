import winston from 'winston'
import transporter from './config/mailerConfig.js'
import MessageService from './services/MessageService.js'
import ProductService from './services/ProductService.js'
const PM = new ProductService()
const CHM = new MessageService()

export default (io) => {
  io.on('connection', socket => {
    console.log('Nuevo cliente conectado -----> ', socket.id)

    const customErrLevels = {
      levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
      }
    }
    const logger = winston.createLogger({
      levels: customErrLevels.levels,
      transports: [
        new winston.transports.Console({ level: 'debug' })
      ]
    })

    socket.on('addProduct', async (data, profile) => {
      // Get Product Data
      const { title, description, code, price, stock, category } = data

      const thumbnails = []
      // Status is true by default
      // Thumbnails is not required, [] by default
      if (profile.role !== 'admin' && profile.role !== 'premium') {
        io.emit('statusError', 'Unauthorized')
      } else {
        const owner = (profile.role === 'premium') ? profile.email : 'admin'
        const newObjectData = { title, description, code, price, stock, category, thumbnails, owner }
        const result = await PM.addProduct(newObjectData)

        if (result.success) {
          const products = await PM.getProducts()
          io.emit('refreshProducts', products)
        } else {
          io.emit('statusError', result)
        }
      }
    })

    socket.on('updateProduct', async (data, profile) => {
      // Get Product Data
      const { title, description, code, price, stock, category } = data

      // Status is true by default
      // Thumbnails is not required, [] by default
      if (profile.role !== 'admin' && profile.role !== 'premium') {
        io.emit('statusError', 'Unauthorized')
      } else {
        const owner = (profile.role === 'premium') ? profile.email : 'admin'
        const newObjectData = { title, description, code, price, stock, category }
        const result = await PM.updateProduct(data._id, newObjectData, owner)

        if (result.success) {
          const products = await PM.getProducts()
          io.emit('refreshProducts', products)
        } else {
          io.emit('statusError', result)
        }
      }
    })

    socket.on('deleteProduct', async (data, profile) => {
      // Delete Existing Product
      // Get Product Id
      if (profile.role !== 'admin' && profile.role !== 'premium') {
        io.emit('statusError', 'Unauthorized')
      } else {
        const owner = (profile.role === 'premium') ? profile.email : 'admin'
        const productId = data
        const result = await PM.deleteProduct(productId, owner)
        if (result.success) {
          const products = await PM.getProducts()

          if (owner !== 'admin') {
            const mailOptions = {
              from: 'GuzH Tech Store' + ' <' + process.env.EMAIL_USER + '>',
              to: owner,
              subject: '[GuzH Tech Store] One of your products has been deleted',
              html: '<p>One of your products has been deleted.</p>'
            }
            try {
              await transporter.sendMail(mailOptions)
              logger.info({ status: 'Success', message: `Notification sent to email: ${owner}.` })
            } catch (error) {
              logger.warning({ status: 'Error', error: 'Error sending email.' })
            }
          }

          io.emit('refreshProducts', products)
        } else {
          io.emit('statusError', result)
        }
      }
    })

    socket.on('productsConnect', async () => {
      const products = await PM.getProducts()
      io.emit('refreshProducts', products)
    })

    socket.on('message', async (data) => {
      await CHM.addMessage(data)
      const messages = await CHM.getAllMessages()
      io.emit('messagesLogs', messages)
    })

    socket.on('userConnect', async (data) => {
      const messages = await CHM.getAllMessages()
      socket.emit('messagesLogs', messages)
      socket.broadcast.emit('newUser', data)
    })
  })
}
