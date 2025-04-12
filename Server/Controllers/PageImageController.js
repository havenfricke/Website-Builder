const BaseController = require('../Utils/BaseController');
const pageImageService = require('../Services/PageImageService');
const { checkSchema, validationResult } = require('express-validator');

const validateAssociation = checkSchema({
  pageId: {
    notEmpty: { errorMessage: 'pageId is required.' },
    isString: { errorMessage: 'pageId must be a string.' }
  },
  imageId: {
    notEmpty: { errorMessage: 'imageId is required.' },
    isString: { errorMessage: 'imageId must be a string.' }
  }
});

class PageImageController extends BaseController {
  constructor() {
    super('page-images');
    // Register routes for the page images endpoints.
    this.router
      .get('/:pageId', this.getAllPageImages)
      .post('', validateAssociation, this.createPageImage)
      .delete('/:pageId/:imageId', this.deletePageImage);
  }

  // GET /page-images/:pageId
  async getAllPageImages(req, res, next) {
    try {
      const { pageId } = req.params;
      const pageImages = await pageImageService.getAllPageImages(pageId);
      res.json({ data: pageImages });
    } catch (error) {
      next(error);
    }
  }

  async createPageImage(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { pageId, imageId } = req.body;
      const created = await pageImageService.createPageImage(pageId.trim(), imageId.trim());
      res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  }


  // DELETE /page-images/:pageId/:imageId
  async deletePageImage(req, res, next) {
    try {
      const { pageId, imageId } = req.params;
      const result = await pageImageService.deletePageImage(pageId, imageId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PageImageController;
