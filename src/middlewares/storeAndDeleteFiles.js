const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')



// Almacenar las fotos en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'tickethubPictures',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
      overwrite: true,
      invalidate: true 
    }
  });


const deleteImgCloudinary = (imgUrl) => {
    // Dividir la URL para obtener el public_id
    const imgSplited = imgUrl.split('/');
    const nameSplited = imgSplited[imgSplited.length - 1].split('.');
    const public_id = nameSplited[0];
    const publicId = `tickethubPictures/${nameSplited[0]}`;
 
    // Localizamos publicId e imprimimos callback indicando que se ha podido eliminar.
    cloudinary.uploader.destroy(publicId)
    .then(result => {
        console.log('Imagen eliminada:', result);
      })
      .catch(error => {
        console.error('Error eliminando la imagen:', error);
      });
}

const upload = multer({ storage });
module.exports = { upload, deleteImgCloudinary }


