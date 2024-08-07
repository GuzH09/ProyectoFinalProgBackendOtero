import { Router } from 'express'
import passport from 'passport'
import UserController from '../controllers/UserController.js'
import { roleauth } from '../middlewares/role-authorization.js'
import { foldervalidation } from '../middlewares/folder-validation.js'
import { uploader } from '../utils/multerUtil.js'
import fs from 'fs'
import __dirname from '../utils/constantsUtil.js'
import CurrentUserDTO from '../DTOs/currentuser.dto.js'

const usersRouter = Router()
const SessionService = new UserController()

// GET All Users
usersRouter.get('/', passport.authenticate('jwt', { session: false }), roleauth(['admin']), async (req, res) => {
  const result = await SessionService.getAllUsers()
  if (result.error) {
    req.logger.warning(result)
    return res.status(400).send(result)
  } else {
    const transformedUsers = result.map(user => new CurrentUserDTO(user))

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
      flagResults.push(await SessionService.flagUserForDeletion(userObj._id))
    }

    req.logger.info({ status: 'success', payload: flagResults })
    return res.status(200).send({ status: 'success', payload: flagResults })

    // Añadir la logica para enviar un mail al usuario
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
