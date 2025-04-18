import type { Request, Response } from 'express'
import User from "../models/User"
import { hashPassword } from '../utils/auth'

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
  user.password = await hashPassword(password)8
  user.handle = handleSlug

  await user.save()
  res.status(201).send('Registro creado correctamente')
}
