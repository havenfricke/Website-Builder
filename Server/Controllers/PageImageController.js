const BaseController = require('../Utils/BaseController');
const pageImageService = require('../Services/PageImageService');

class PageImageController extends BaseController {
  constructor() {
    super('page-images');
    // Register routes for the page images endpoints.
    this.router
      .get('/:pageId', this.getAllPageImages)
      .post('', this.createPageImage)
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
    try {
      const { pageId, imageId } = req.body;
      console.log("Creating association with:", pageId, imageId);
      const created = await pageImageService.createPageImage(pageId, imageId);
      res.json({ data: created });
    } catch (error) {
      console.error("Error in createPageImage:", error);
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
