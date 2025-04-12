const imageRepository = require('../Repositories/ImageRepository');
const Image = require('../Models/Image');
const IdGen = require('../Utils/IdGen');

async function getAllImages(queryParams) {
  const images = await imageRepository.getAllImages(queryParams);
  return images.map(image => {
    // the base64 needs to be a string when coming back from the api / db.
    const dataUrl = image.content.toString('utf8');
    return new Image(image.id, image.title, image.alt_text, dataUrl);
  });
}

async function getImageById(id) {
  const image = await imageRepository.getImageById(id);
  if (!image) {
    throw new Error('Image not found');
  }
  return new Image(image.id, image.title, image.alt_text, image.content);
}

// async function createImage(body) {
//     const id = IdGen.getId();
//     const created = await imageRepository.createImage(id, body);
//     return new Image(created.id, created.title, created.alt_text, created.content);
//   }

async function createImage(body) {
    const created = await imageRepository.createImage(body);
    return new Image(created.id, created.title, created.alt_text, created.content);
  }

async function editImage(update, id) {
  const original = await imageRepository.getImageById(id);
  if (!original) {
    throw new Error("Image not found");
  }

  const updatedImage = {
    title: update.title ? update.title : original.title,
    altText: update.altText ? update.altText : original.alt_text, 
    content: update.content ? update.content : original.content
  };

  const updated = await imageRepository.editImage(id, updatedImage);
  return new Image(updated.id, updated.title, updated.altText, updated.content);
}

async function deleteImage(id) {
  const original = await imageRepository.getImageById(id);
  if (!original) {
    throw new Error("Image not found");
  }
  await imageRepository.deleteImage(id);
  return { message: "Image deleted successfully" };
}

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  editImage,
  deleteImage
};

// the service layer acts as the heart of your 
// application by housing the business logic, 
// making it easier to manage, test, and evolve 
// the application in line with business needs.
