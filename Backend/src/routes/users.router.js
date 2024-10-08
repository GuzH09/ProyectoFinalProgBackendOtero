import { Router } from 'express'
import passport from 'passport'
import UserController from '../controllers/UserController.js'
import { roleauth } from '../middlewares/role-authorization.js'
import { foldervalidation } from '../middlewares/folder-validation.js'
import { uploader } from '../utils/multerUtil.js'
import fs from 'fs'
import __dirname from '../utils/constantsUtil.js'
import AllUsersDTO from '../DTOs/allusers.dto.js'
import transporter from '../config/mailerConfig.js'

const usersRouter = Router()
const SessionService = new UserController()

// GET All Users
usersRouter.get('/', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const result = await SessionService.getAllUsers()
  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    const transformedUsers = result.map(user => new AllUsersDTO(user))

    req.logger.info({ status: 'success', payload: transformedUsers })
    return res.status(200).send({ status: 'success', payload: transformedUsers })
  }
})

// Flag for deletion all users that didnt connect since last two days
usersRouter.delete('/', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const result = await SessionService.getAllUsers()

  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    // Current date and two days ago
    const twoDaysAgo = Date.now() - (1000 * 60 * 60 * 24 * 2)

    // Filter users who have not connected in the last two days
    const usersToFlag = result.filter(user => {
      const lastConnectionDate = new Date(user.last_connection).getTime()
      return lastConnectionDate < twoDaysAgo
    })

    // Delete users who have not connected in the last two days
    const flagResults = []
    for (const userObj of usersToFlag) {
      const queryResults = []

      queryResults.push(await SessionService.flagUserForDeletion(userObj._id))

      const mailOptions = {
        from: 'GuzH Tech Store' + ' <' + process.env.EMAIL_USER + '>',
        to: userObj.email,
        subject: '[GuzH Tech Store] Your account has been flagged for deletion for inactivity',
        html: '<p>Your account has been flagged for deletion due to inactivity.</p>'
      }

      try {
        await transporter.sendMail(mailOptions)
        req.logger.info({ status: 'Success', message: `Inactivity email sent to ${userObj.email}.` })
        queryResults.push({ success: `Inactivity email sent to ${userObj.email}.` })
      } catch (error) {
        req.logger.warning({ status: 'Error', error: 'Error sending email.' })
        req.logger.warning(error)
        queryResults.push({ error: `Error sending email to ${userObj.email}.` })
      }

      flagResults.push(queryResults)
    }

    req.logger.info({ status: 'success', payload: flagResults })
    return res.status(200).send({ status: 'success', payload: flagResults })
  }
})

// GET User By ID
usersRouter.get('/:uid', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const result = await SessionService.getUser(req.params.uid)
  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    req.logger.info({ status: 'success', payload: result })
    return res.status(200).send({ status: 'success', payload: result })
  }
})

// DELETE User
usersRouter.delete('/:uid', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const userCart = await SessionService.deleteUserCart(req.params.uid)
  if (userCart.error) {
    req.logger.warning(userCart)
    return res.status(400).send(userCart)
  } else {
    req.logger.info({ status: 'success', payload: userCart })
    const userProducts = await SessionService.deleteUserProducts(req.params.uid)
    if (userProducts.error) {
      req.logger.warning(userProducts)
      return res.status(400).send(userProducts)
    } else {
      req.logger.info({ status: 'success', payload: userProducts })
      const result = await SessionService.deleteUser(req.params.uid)
      if (result.error) {
        req.logger.warning(result)
        return res.status(400).send(result)
      } else {
        req.logger.info({ status: 'success', payload: result })
        return res.status(200).send({ status: 'success', payload: result })
      }
    }
  }
})

// UPDATE User
usersRouter.put('/:uid', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const result = await SessionService.updateUser(req.params.uid, req.body.role)
  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    req.logger.info({ status: 'success', payload: result })
    return res.status(200).send({ status: 'success', payload: result })
  }
})

// POST Upgrade User To Premium or viceversa
// Solo si ya se han cargado 3 documentos:
usersRouter.post('/premium/:uid', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const user = await SessionService.getUser(req.params.uid)
  if (user.error) {
    req.logger.warning(user)
    return res.status(400).send(user)
  } else {
    req.logger.info({ user })
  }

  let result = ''
  if (user.role === 'premium') {
    result = await SessionService.updateUser(req.params.uid, 'user')
  } else {
    // Check if there are at least 3 files in the documents directory
    try {
      const files = await fs.promises.readdir(`${__dirname}/../../public/documents/${user._id.toString()}`)
      if (files.length >= 3) {
        // Update role to premium if there are at least 3 files
        result = await SessionService.updateUser(req.params.uid, 'premium')
      } else {
        // Return an error if there are not enough files
        result = { error: 'Not enough documents to update role to premium.' }
      }
    } catch (error) {
      result = { error: 'Not enough documents to update role to premium.' }
    }
  }

  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    req.logger.info({ result })
    return res.status(200).send(result)
  }
})

// POST Upload documents files
usersRouter.post('/:uid/documents', passport.authenticate('jwt', { session: false }), foldervalidation(SessionService), async (req, res, next) => {
  // Subir los archivos con el multer
  uploader.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'document', maxCount: 3 }
  ])(req, res, (err) => {
    if (err) {
      req.logger.warning({ error: 'Error uploading files.' })
      return res.status(400).send({ error: 'Error uploading files.' })
    }
    next()
  })
}, async (req, res) => {
  try {
    // Actualizar al usuario con las referencias a los distintos archivos
    const user = req.userFound // Usar el usuario pasado desde el primer middleware

    const { profilePicture, document } = req.files
    if (profilePicture) {
      // Actualizar ProfilePicture
      user.profilePicture = profilePicture[0].path
    }
    if (document) {
      // Actualizar Documentos
      // ¿Que pasa si se suben documentos que ya existen?
      user.documents = document.map(file => file.path)
    }

    req.logger.info({ message: 'Files uploaded successfully', user })
    res.status(200).send({ message: 'Files uploaded successfully', user })
  } catch (error) {
    req.logger.warning({ error: error.message })
    return res.status(400).send({ message: 'Error uploading files', error: error.message })
  }
})

export default usersRouter
