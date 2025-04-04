const pageRepository = require('../Repositories/PageRepository');
const Page = require('../Models/Page');
const IdGen = require('../Utils/IdGen');

async function getAllPages(queryParams) {
  const pages = await pageRepository.getAllPages(queryParams);
  return pages.map(pages => new Page(pages.id, pages.title, pages.content));
}

async function getPageById(id) {
  const page = await pageRepository.getPageById(id);
  if (!page) {
    throw new Error('Page not found');
  }
  return new Page(page.id, page.title, page.content);
}

async function createPage(body) {
  const id = IdGen.getId();
  const created = await pageRepository.createPage(id, body);
  return new Page(created.id, created.title, created.content);
}

async function editPage(update, id) {
  const original = await pageRepository.getPageById(id);
  if (!original) {
    throw new Error("Page not found");
  }

  const updatedPage = {
    title: update.title ? update.title : original.title,
    content: update.content ? update.content : original.content
    // additional data to edit
  };

  const updated = await pageRepository.editPage(id, updatedPage);
  return new Page(updated.id, updated.title, updated.content);
}

async function deletePage(id) {
  const original = await pageRepository.getPageById(id);
  if (!original) {
    throw new Error("Page not found");
  }
  await pageRepository.deletePage(id);
  return { message: "Page deleted successfully" };
}

module.exports = {
  getAllPages,
  getPageById,
  createPage,
  editPage,
  deletePage
};

// the service layer acts as the heart of your 
// application by housing the business logic, 
// making it easier to manage, test, and evolve 
// the application in line with business needs.
