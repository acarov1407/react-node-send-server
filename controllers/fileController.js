const getUpload = require('../config/multer');
const Link = require('../models/Link');
const User = require('../models/User');
const userController = require('./userController');
const fs = require('fs');


exports.uploadFile = async (req, res) => {

    const upload = getUpload(req, res);

    upload(req, res, async (error) => {
        if(req.user){
            if(req.user.fileLimit === 0){
                return res.status(400).json({msg: 'Has superado tu limite de subida de archivos. Intenta eliminar alguno para continuar'})
            }
        }
        if (!error) {
            return res.json({ file: req.file.filename });
        } else {
            return res.status(400).json({ error })
        }
    })
}

exports.downloadFile = async (req, res, next) => {

    const { file } = req.params;
    const filePath = __dirname + '/../uploads/' + file;

    try {
        const link = await Link.findOne({ name: file });
        if (!link) return res.status(404).json({ msg: 'El archivo que intentas descargar ya no está disponible' })

        await res.download(filePath, link.real_name);
        //Check If necessary to delete file
        if (link.limit === 1) {

            req.file = link.name;

            //Delete link data from DB
            await link.deleteOne()

            //Change user file limit
            if (link.author) {
                await userController.changeUserFileLimit(req, res, { _id: link.author, isAdding: true});
            }


            //delete file
            fs.unlinkSync(__dirname + `/../uploads/${req.file}`);

        } else {
            link.limit -= 1;
            await link.save();
        }


    } catch (error) {
        return res.status(400).json({ msg: 'Ha ocurrido un error al intentar descargar el archivo' });
    }


}

exports.deleteFile = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
        return res.json({msg: 'Archivo eliminado correctamente'});
    
    } catch (error) {
        return res.status(400).json({msg: 'Ha ocurrido un error al intentar eliminar el archivo'})
        
    }
}