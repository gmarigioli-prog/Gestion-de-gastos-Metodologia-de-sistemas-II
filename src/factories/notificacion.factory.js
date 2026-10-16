function crearNotificacion({ tipo, destinatario, asunto, mensaje }) {
  if (typeof tipo !== 'string' || tipo.trim() === '') {
    throw new TypeError('El tipo de notificación es obligatorio')
  }

  if (
    typeof destinatario !== 'string' ||
    !test(destinatario)
  ) {
    throw new TypeError('Se requiere una dirección de correo válida')
  }

  if (typeof asunto !== 'string' || asunto.trim() === '') {
    throw new TypeError('El asunto de la notificación es obligatorio')
  }

  if (typeof mensaje !== 'string' || mensaje.trim() === '') {
    throw new TypeError('El mensaje de la notificación es obligatorio')
  }

  return Object.freeze({
    tipo: tipo.trim(),
    destinatario: destinatario.trim(),
    asunto: asunto.trim(),
    mensaje: mensaje.trim(),
    creadaEn: new Date()
  })
}

module.exports = { crearNotificacion }
