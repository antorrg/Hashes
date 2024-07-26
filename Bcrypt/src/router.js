import express from 'express'
import serv from './service.js'
const router = express.Router()

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await serv.userRegister(email, password)
        res.status(201).json(response)
      } catch (error) {
        res.status(error.status || 500).json({error: error.message})
      }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  try {
    const response = await serv.userLogin(email, password)
    res.status(200).json(response)
  } catch (error) {
    res.status(error.status || 500).json({error: error.message})
  }
});

export default router;