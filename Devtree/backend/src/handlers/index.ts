import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import User from "../models/User"
import { hashPassword, checkPassword } from '../utils/auth'

export const createAccount = async (req : Request, res : Response) => {
  const slug = (await import('slug')).default
  const { email, password, handle } = req.body

  const userExists = await User.findOne({email})
  if (userExists) {
    const error = new Error ('El Usuario ya está registrado')
    res.status(409).json({error : error.message})
  }

  const handleSlug = slug(handle, '')
  const handleExists = await User.findOne({handle: handleSlug})
  if (handleExists) {
    const error = new Error ('Nombre de usuario no disponible')
    res.status(409).json({error : error.message})
  }

  const user = new User(req.body)
  user.password = await hashPassword(password)
  user.handle = handleSlug

  await user.save()
  res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  //Manejo de errores
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()})
  }

  //Revisar si el usuario está registrado
  const user = await User.findOne({email})
  if (!user) {
    const error = new Error ('Este usuario no existe')
    res.status(404).json({error : error.message})
  }

  //Validar si la contra seña es correcta
  const isPasswordCorrect = await checkPassword(password, user.password)
  if (!isPasswordCorrect) {
    const error = new Error ('Password Incorrecto')
    res.status(401).json({error : error.message})
  }

  res.send('Autenticado...')
}
