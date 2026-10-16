<<<<<<< Updated upstream
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
=======
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("*", (_request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Gestor de gastos disponible en http://localhost:${port}`);
});
>>>>>>> Stashed changes
