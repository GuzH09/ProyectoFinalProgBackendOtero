import fs from 'fs'
import __dirname from '../utils/constantsUtil.js'

export const foldervalidation = (SessionService) => {
  return async (req, res, next) => {
    // Conseguir el usuario
    // Validar que el usuario exista y
    // ¿No deberia validar que el usuario loggeado es el usuario que se está pasando como parametro?
    const user = await SessionService.getUser(req.params.uid)
    console.log(user)
    if (user.error) {
      req.logger.warning(user)
      return res.status(400).send(user)
    } else {
      req.logger.info({ user })
      req.userFound = user // Pasar el usuario encontrado al siguiente middleware
      // Crea la carpeta para los archivos del usuario especifico si es que no existe
      try {
        await fs.promises.mkdir(`${__dirname}/../../public/documents/${user._id.toString()}`, { recursive: true })
        await fs.promises.mkdir(`${__dirname}/../../public/img/profiles/${user._id.toString()}`, { recursive: true })
      } catch (error) {
        req.logger.warning({ error: `Error creating directory: ${error.message}` })
      }
    }
    next()
  }
}
