const {Producto} = require('../models');


//obtenerCategorias - paginado - total - populate
const obtenerProductos = async(req, res) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [productos, total] = await Promise.all([
        Producto.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate('usuario', 'nombre'),
            Producto.countDocuments(query)
    ])

    if(!productos){
        return res.status(404).json({
            msg: 'No hay productos'
        })
    }

    res.status(200).json({total, productos })
}

//obtenerCategoria - populate {}
const obtenerProducto = async(req, res) => {
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre');

    res.json(producto);
}

const crearProducto = async(req, res) => {

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    
    await producto.save();

    res.status(201).json(producto);

}

// actualizarCategoria - por nombre
const actualizarProducto = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);

}

//borrarCategoria - cambiar estado : false
const borrarProducto = async(req, res) => {
    const {id} = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false});

    res.json({
        productoBorrado,
    })
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
}