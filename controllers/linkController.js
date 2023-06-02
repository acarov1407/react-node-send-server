const Link = require('../models/Link')
const userController = require('./userController');
const shortid = require('shortid');
const hashing = require('../helpers/hashing');
const { validationResult } = require('express-validator');


exports.createLink = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { real_name, name } = req.body;

    const link = new Link();
    link.url = shortid.generate();
    link.name = name;
    link.real_name = real_name;
    link.extension = real_name.split('.').slice(-1)[0];


    //Is user Auth
    if (req.user) {
        const { password, limit } = req.body;

        if (password) link.password = await hashing.hashPassword(password);
        if (limit) link.limit = limit;
        link.author = req.user._id;

        //Change user file limit
        await userController.changeUserFileLimit(req, res, {_id: req.user._id, isAdding: false})
    }

    try {
        await link.save();
        return res.json({ url: link.url })
    } catch (error) {
        return res.status(400).json({ msg: 'No se ha podido crear el enlace' })
    }

}

exports.getLink = async (req, res) => {

    const { url } = req.params;

    //Check Link exists
    const link = await Link.findOne({ url });
    if (!link) {

        return res.status(404).json({ msg: 'URL no válida' })

    }

    return res.json({ file: link.name, isProtected: link.password ? true : false});
}

exports.getAllLinks = async (req, res) => {

    try {
        const links = await Link.find({}).select('url -_id');
        return res.json({ links })
    } catch (error) {
        return res.status(400).json({ msg: 'Ha ocurrido un error al intentar obtener los enlaces' });
    }
}

exports.getUserLinks = async (req, res) => {


    if(!req?.user?._id){
        return res.status(401).json({msg: 'Permisos insuficientes'})
    }

    try{
        const links = await Link.find({
            author: req.user._id
        })

        return res.json({links});

    }catch(error){
        return res.status(400).json({msg: 'Ha ocurrido un error al intentar obtener los enlaces'});
    }
}

exports.checkPassword = async (req, res) => {
    const { password } = req.body;
    try{
        const link = await Link.findOne({url: req.params.url})
        const isCorrectPass = hashing.checkPassword(password, link.password);
        return res.json({isCorrectPass})

    }catch(error){
        return res.status(400).json({msg: 'Ha ocurrido un error al comprobar la contraseña'})
    }
}

exports.deleteLink = async (req, res, next) => {
    const { url } = req.params;

    if(!req.cookies.token) return res.status(401).json({msg: 'Permisos insuficientes'});

    try{
        const link = await Link.findOne({url});
        if(!link) return res.status(404).json({msg: 'El enlace que se intenta eliminar no existe'});

        req.file = link.name;
        await link.deleteOne();
        
        if(link.author){
            await userController.changeUserFileLimit(req, res, {_id: link.author, isAdding: true});
        }

        //Go to delete file
        next();

    }catch(error){
        return res.status(400).json({msg: 'Ha ocurrido un error al intentar eliminar el enlace'})
    }
}