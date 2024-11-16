// roomController.js
const db = require('./db');

// Obtener todas las habitaciones
exports.traerHabitaciones = (req, res) => {
    db.query('SELECT * FROM habitacion', (err, results) => {
        if (err) return res.status(500).send('Error de base de datos');
        res.json(results);
    });
};

exports.traerHabitacionesAll = (req, res) => {
    console.log(req)
    db.query('SELECT * FROM habitacion', (err, results) => {
        if (err) return res.status(500).send('Error de base de datos');
        res.json(results);
    });
};

// Marcar una habitación como reservada
exports.reservarHabitacion = (req, res) => {

    const { id } = req.params;  // Obtener ID de la habitación desde la URL
    const query = 'UPDATE habitacion SET estado = "Reservada" WHERE id = ?';
    db.execute(query, [id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado: ', err);
            return res.status(500).json({ error: 'Error al actualizar el estado' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }
        res.status(200).json({ message: 'Estado actualizado correctamente' });
    });
};

exports.crearhabitacion = (req, res) => {
    const { numero, tipo, precio, estado, descripcion } = req.body;
    db.query('INSERT INTO habitacion (numero, tipo, precio, estado, descripcion) VALUES (?, ?, ?, ?, ?)', [numero, tipo, precio, estado, descripcion], (err, results) => {
        if (err) return res.status(500).send('Error al crear la habitación');
        res.status(201).send({ status:201, msg:'Habitación creada'});
    });
};

exports.actualizarhabitacion = (req, res) => {
    const { id } = req.params;
    const { numero, tipo, descripcion,precio, estado } = req.body;
    console.log(id)
    console.log(req.body)
    const query = 'UPDATE habitacion SET numero = ?, tipo= ?, descripcion = ?, precio= ?, estado= ? WHERE id = ?';
    const values = [numero, tipo, descripcion,precio, estado,id];

    db.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitacion no encontrado' });
        }
        res.json({ status: 200, msg: 'Habitacion actualizado correctamente' });
    });
};