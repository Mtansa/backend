// reservationController.js
const db = require('./db');

// Obtener todas las reservas
exports.getReservations = (req, res) => {
    db.query('SELECT r.*, u.nombre, u.telefono, u.email FROM reservas r INNER JOIN usuarios u ON r.usuario_id = u.id   ', (err, results) => {
        //SELECT *, u.nombre, u.telefono, u.email FROM reservas r INNER JOIN usuarios u ON r.usuario_id = u.id
        if (err) return res.status(500).send('Error de base de datos');
        res.json(results);
    });
};

exports.getReservationsxCliente = (req, res) => {
    const { USUARIO_ID } = req.params;

    const query = 'SELECT * from reservas WHERE usuario_id = ?';
    db.execute(query, [USUARIO_ID], (err, results) => {
        if (err) {

            return res.status(500).json({ status: 404,   msg: 'Error al consultar el usuario' });
        }

        res.status(200).json({ reservas: results });
    });
};

// Crear una nueva reserva
exports.reservacion = (req, res) => {
    console.log(req.body)
    const { USER_ID, ID_HAB, FECHA_E, FECHA_S } = req.body;
    db.query('INSERT INTO reservas (usuario_id, habitacion_id, entrada, salida) VALUES (?, ?, ?, ?)', [USER_ID,ID_HAB, FECHA_E, FECHA_S], (err, results) => {
        if (err) return res.status(500).send('Error al crear la reserva');
        res.status(201).send({status: 201, msg: 'Reserva creada'});

    });
};

exports.verificarReserva = (req,res) => {

    const { ID_HAB, FECHA_E, FECHA_S } = req.body;
    const query = `
    SELECT * FROM reservas WHERE habitacion_id = ?  AND ((entrada <= ? AND salida >= ?) OR (entrada >= ? AND salida <= ?))`;

    db.query(query, [ID_HAB, FECHA_S, FECHA_E, FECHA_E, FECHA_S], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al verificar disponibilidad.' });
        }
        const reservas = results[0];
        console.log(reservas);
        if (results.length > 0) {
                return res.status(200).json({
                    status: 400,
                    msg: 'La habitación ya está ocupada en las fechas seleccionadas.'
                });
        }

        res.status(200).json({ status: 200,  msg: 'La habitación está disponible para las fechas seleccionadas.' });
    });


}

exports.cancelareserva = (req, res) => {
    const { id } = req.params;  // Obtener ID de la habitación desde la URL
    console.log(req.params)
    //const query = 'UPDATE reservas SET estado = "cancelada" WHERE id = ?';
    const query = 'DELETE FROM reservas WHERE id = ?';
    db.execute(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json({ status: 200,  msg: 'Reserva cancelada correctamente' });
    });
};

exports.confirmareserva = (req, res) => {
    /*const { id } = req.params;  // Obtener ID de la habitación desde la URL
    console.log(id)
    const query = 'UPDATE reservas SET estado = "confirmada" WHERE id = ?';
    db.execute(query, [id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado: ', err);
            return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json({ status: 200,  msg: 'Habitación confirmada correctamente' });
    });*/
    const { id } = req.params;
    const { estado } = req.body;
    console.log(id)
    console.log(req.body)
    //const conf = "confirmada";
    const query = 'UPDATE reservas SET estado = ? WHERE id = ?';
    const values = [estado, id];

    db.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitacion no encontrado' });
        }
        res.json({ status: 200, msg: 'Confirmada' });
    });
};





