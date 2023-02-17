const {Categoria} = require('../models');


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [categorias, total] = await Promise.all([
        Categoria.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre'),
            Categoria.countDocuments(query)
    ])

    if(!categorias){
        return res.status(404).json({
            msg: 'No hay categorias'
        })
    }

    res.status(200).json({total, categorias })
}

//obtenerCategoria - populate {}
const obtenerCategoria = async(req, res) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria - por nombre
const actualizarCategoria = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);

}

//borrarCategoria - cambiar estado : false
const borrarCategoria = async(req, res) => {
    const {id} = req.params;
    const usuario = req.usuario;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});

    res.json({
        categoria,
        usuario
    })
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
}