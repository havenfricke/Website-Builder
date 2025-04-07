const pageImageRepository = require('../Repositories/PageImageRepository');
const PageImage = require('../Models/PageImage');

async function getAllPageImages(pageId) {
  const images = await pageImageRepository.getAllPageImages(pageId);
  return images.map(image => {
    // Convert the binary image content to a UTF-8 string (or base64 if required)
    const dataUrl = image.imageContent.toString('utf8');
    return new PageImage(
      image.pageId,
      image.imageId,
      image.htmlTitle,
      image.imageTitle,
      image.altText,
      dataUrl
    );
  });
}

async function createPageImage(pageId, imageId) {
  const created = await pageImageRepository.createPageImage(pageId, imageId);
  return new PageImage(
    created.pageId,
    created.imageId,
    created.htmlTitle,
    created.imageTitle,
    created.altText,
    created.imageContent
  );
}

async function deletePageImage(pageId, imageId) {
  await pageImageRepository.deletePageImage(pageId, imageId);
  return { message: "Page image association deleted successfully" };
}

module.exports = {
  getAllPageImages,
  createPageImage,
  deletePageImage,
};
