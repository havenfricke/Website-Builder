const multer = require('multer')
const path = require('path')
const pageService = require('../Services/PageService')
const BaseController = require('../Utils/BaseController')


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'Uploads/')
  },
  filename: (req, file, callback) => {
    const { name, ext } = path.parse(file.originalname)
    callback(null, `${name}-${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowedFileMimeTypes = ['image/png', 'image/jpg', 'image/jpeg']
    callback(null, allowedFileMimeTypes.includes(file.mimetype))
  }
})

class PageController extends BaseController {
  constructor() {
    super('pages')
    // Register the routes
    this.router
      .get('', upload.none(), this.getAllPages)
      .get('/:id', upload.none(), this.getPageById)
      .post('', upload.none(), this.createPage)
      .put('/:id', upload.none(), this.editPage)
      .delete('/:id', upload.none(), this.deletePage)
  }

  async getAllPages(req, res, next) {
    try {
      const pages = await pageService.getAllPages(req.query)
      res.json({ data: pages })
    } catch (error) {
      next(error)
    }
  }

  async getPageById(req, res, next) {
    try {
      const page = await pageService.getPageById(req.params.id)
      res.json({ data: page })
    } catch (error) {
      next(error)
    }
  }

  async createPage(req, res, next) {
    try {
      const newPage = await pageService.createPage(req.body);
      res.status(201).json({ data: newPage });
      console.log(visitorIP);
    } catch (error) {
      next(error);
    }
  }

  async editPage(req, res, next){
    try {
      const page = await pageService.editPage(req.body, req.params.id);
      res.json({ data: page })
      console.log(visitorIP);
    } catch (error){
      next(error)
    }
  }

  async deletePage(req, res, next) {
    try {
      const result = await pageService.deletePage(req.params.id);
      res.json({ data: result });
      console.log(visitorIP);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PageController

// In Express, the incoming request data is 
// separated into different objects based on 
// where the data comes from:

// req.params:
// This object contains route parameters—parts 
// of the URL that are defined in your route path. 
// For example, if you define a route as /pages/:id, 
// the value of :id is accessible via req.params.id.

// req.body:
// This object contains data that is sent in the 
// body of the request (commonly in POST or PUT requests). 
// This data is usually parsed from JSON or form data.

// We don't use something like body.params because 
// Express separates these concerns into different 
// properties (req.params for URL parameters and req.body 
// for request payload). This design helps to clarify 
// the source of the data in your request.

// next as a Parameter:
// You see next as a parameter because Express automatically 
// provides it when you define your route handler. It’s just 
// like req and res - all are part of the standard function 
// signature for middleware in Express.

// next as a Function:
// When you call next(error), you’re not just "invoking a parameter"; 
// you’re executing a function that Express uses internally to 
// determine what should happen next. When an error is passed to next(), 
// Express recognizes this and will pass the error to any error-handling middleware