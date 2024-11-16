
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');



exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).send('Error de base de datos');
        if (results.length === 0) return res.status(200).send({status: 404, msg: 'Credenciales inválidas'});
        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(200).send({status: 404, msg: 'Credenciales inválidas'});

        const token = jwt.sign({ id: user.id, role: user.role }, 'miguel', { expiresIn: '1d' });
        res.json({ status: 200,  id: user.id, email: user.email, nombre: user.nombre, telefono: user.telefono, perfil: user.role,  token: token });
        console.log(user)
    });
};
exports.register = async (req, res) => {
    console.log(req.body);
    const { email, password, nombre,telefono, role } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO usuarios (email, password, nombre, telefono, role) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, nombre, telefono,  role], (err, results) => {
        if (err) return res.status(200).send({status: 404, msg: 'Usuario ya existe en la base de datos.!'});
        return  res.status(200).send({status: 200, msg : 'Usuario registrado correctamente'});

    });
};

exports.usuarios = async (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send('Error de base de datos');
        res.json(results);
    });
};

exports.actualizarusuario = (req, res) => {
    const { id } = req.params;
    const { nombre,telefono, role } = req.body;
    const query = 'UPDATE usuarios SET nombre = ?, telefono= ?, role = ? WHERE id = ?';
    const values = [nombre, telefono,role, id];

    db.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ status: 200, msg: 'Usuario actualizado correctamente' });
    });
};

exports.eliminarusuario = (req, res) => {
    const { id } = req.params;  // Obtener ID de la habitación desde la URL
    console.log(req.params)
    //const query = 'UPDATE reservas SET estado = "cancelada" WHERE id = ?';
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.execute(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al Eliminar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrada' });
        }
        res.status(200).json({ status: 200,  msg: 'Usuario eliminado correctamente' });
    });
};

