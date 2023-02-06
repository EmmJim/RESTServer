const {Router} = require('express');
const {check} = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet)
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
], validarCampos, usuariosPut)
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
    check('rol').custom(esRoleValido),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
] , validarCampos ,usuariosPost)
router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


module.exports = router;