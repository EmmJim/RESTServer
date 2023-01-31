const {response} = require('express');

const usuariosGet = (req, res = response) => {

    console.log(req.query)

    res.status(403).json({
        msg: 'get API - Controlador'
    });
}
const usuariosPut = (req, res = response) => {

    console.log(req.params);

    res.status(403).json({
        msg: 'put API - Controlador'
    });
}
const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(403).json({
        msg: 'post API - Controlador',
        nombre,
        edad
    });
}
const usuariosDelete = (req, res = response) => {
    res.status(403).json({
        msg: 'delete API - Controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}