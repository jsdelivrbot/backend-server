var express = require('express');
var bcrypt = require('bcryptjs'); // https://github.com/dcodeIO/bcrypt.js

var app = express();

var Usuario = require('../models/usuario');

//=============================
// Obtener todos los usuarios
//=============================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
                // si no sucede ningun error
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            })
});


//=============================
// Crear un nuevo usuario
//=============================
app.post('/', (req, res) => {

    // Extraemos el body
    var body = req.body; // <-- usando el Body parser

    // Creamos un objeto de tipo Usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // Para guardar
    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        // Si no sucede ningun error
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });
});


//=============================
// Actualizar usuario
//=============================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) { // Si viene null

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        // Actualizo la info del usuario (Opción 1)
        /*usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;*/

        // Actualizo la info del usuario (Opción 2)
        Object.keys(req.body).forEach(key => {
            usuario[key] = req.body[key];
        });

        // Grabar la info
        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            // para no imprimir el password
            usuarioGuardado.password = ';)';

            // Si no sucede ningun error
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});



module.exports = app;