const fs = require('fs').promises

const getUsuarioAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/usuarios.json', 'utf8')
    const usuarios = JSON.parse(data)

    return res.status(200).json(usuarios)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se pudieron obtener los datos de los usuarios' })
  }
}

const getUsuarioById = async (req, res) => {
  try {
    const data = await fs.readFile('./data/usuarios.json', 'utf8')
    const usuarios = JSON.parse(data)

    const { id } = req.params

    const usuarioId = usuarios.find(
      (u) => u.id === Number(id)
    )

    if (!usuarioId) {
      return res
        .status(404)
        .json({ msg: `No existe el usuario con el id ${id}` })
    }

    return res.status(200).json(usuarioId)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo obtener el detalle del usuario'
    })
  }
}

const postNewUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const data = await fs.readFile('./data/usuarios.json', 'utf8')
    const usuarios = JSON.parse(data)

    const ids = usuarios.map((usuario) => usuario.id)
    const nuevoId = Math.max(...ids) + 1

    const nuevoUsuario = {
      id: nuevoId,
      nombre,
      apellido,
      email,
      fechaAlta: new Date().toISOString().split('T')[0],
      modificacion: new Date().toISOString().split('T')[0],
      isActive: true
    }

    usuarios.push(nuevoUsuario)

    await fs.writeFile(
      './data/usuarios.json',
      JSON.stringify(usuarios, null, 2),
      'utf8'
    )

    return res.status(201).json({
      msg: 'Usuario creado correctamente',
      usuario: nuevoUsuario
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'No se pudo crear el usuario'
    })
  }
}

const putUsuarioById = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, email, isActive } = req.body

    const data = await fs.readFile('./data/usuarios.json', 'utf8')
    const usuarios = JSON.parse(data)

    const index = usuarios.findIndex(
      (usuario) => usuario.id === Number(id)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: `No existe el usuario con id ${id}`
      })
    }

    if (nombre) usuarios[index].nombre = nombre
    if (apellido) usuarios[index].apellido = apellido
    if (email) usuarios[index].email = email
    if (isActive !== undefined) usuarios[index].isActive = isActive

    usuarios[index].modificacion =
      new Date().toISOString().split('T')[0]

    await fs.writeFile(
      './data/usuarios.json',
      JSON.stringify(usuarios, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: 'Usuario modificado correctamente',
      usuario: usuarios[index]
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'No se pudo modificar el usuario'
    })
  }
}

const deleteUsuarioById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await fs.readFile('./data/usuarios.json', 'utf8')
    const usuarios = JSON.parse(data)

    const index = usuarios.findIndex(
      (usuario) => usuario.id === Number(id)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: `No existe el usuario con id ${id}`
      })
    }

    const usuarioEliminado = usuarios[index]

    usuarios.splice(index, 1)

    await fs.writeFile(
      './data/usuarios.json',
      JSON.stringify(usuarios, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: 'Usuario eliminado correctamente',
      usuario: usuarioEliminado
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'No se pudo eliminar el usuario'
    })
  }
}

module.exports = {
  getUsuarioAll,
  getUsuarioById,
  postNewUsuario,
  putUsuarioById,
  deleteUsuarioById
}