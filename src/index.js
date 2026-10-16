import 'dotenv/config'
import express from 'express'
import usuarioRoutes from './routes/usuario.routes.js'

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(express.json())
app.use('/api/usuarios', usuarioRoutes)

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})