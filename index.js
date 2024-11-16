const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authController = require('./autenticacion');
const reservas = require('./reservas');
const habitacion = require('./habitaciones');
const authMiddleware = require('./authMiddleware');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Rutas de autenticación
app.post('/login', authController.login);
app.post('/registrar', authController.register);
app.get('/usuarios', authController.usuarios);
app.put('/actualizarusuario/:id', authController.actualizarusuario);
app.delete('/eliminarusuario/:id', authController.eliminarusuario);


// Rutas protegidas con JWT
//Reservas
//authMiddleware,
app.get('/reservas', reservas.getReservations);
app.post('/reservacion', reservas.reservacion);
app.post('/verificarReserva', reservas.verificarReserva);
app.get('/reservasxcliente/:USUARIO_ID', reservas.getReservationsxCliente);
app.delete('/cancelareserva/:id', reservas.cancelareserva);
app.put('/confirmareserva/:id', reservas.confirmareserva);


//Habitaciones
app.get('/habitaciones', habitacion.traerHabitaciones);
// => /reserve le quite el parametro
app.put('/habitacion/:id', habitacion.reservarHabitacion);
app.post('/crearhabitacion', habitacion.crearhabitacion);
app.get('/habitacionesall', habitacion.traerHabitacionesAll);
app.put('/actualizarhabitacion/:id', habitacion.actualizarhabitacion);




app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
