const db = require("../DB/DbConnection");

async function getAllPageImages(pageId) {
  const sql = `
    SELECT 
      pi.page_id AS pageId,
      pi.image_id AS imageId,
      p.title AS htmlTitle,
      p.content AS htmlContent,
      i.title AS imageTitle,
      i.alt_text AS altText,
      i.content AS imageContent
    FROM page_images pi
    INNER JOIN pages p ON pi.page_id = p.id
    INNER JOIN images i ON pi.image_id = i.id
    WHERE pi.page_id = ?;
  `;
  return await db.query(sql, [pageId]);
}

async function createPageImage(pageId, imageId) {
  const insertSql = 'INSERT INTO page_images (page_id, image_id) VALUES (?, ?)';
  await db.query(insertSql, [pageId, imageId]);
  
  // Fetch the complete page image data including the HTML and image details
  const selectSql = `
    SELECT 
      pi.page_id AS pageId,
      pi.image_id AS imageId,
      p.title AS htmlTitle,
      i.title AS imageTitle,
      i.alt_text AS altText,
      i.content AS imageContent
    FROM page_images pi
    INNER JOIN pages p ON pi.page_id = p.id
    INNER JOIN images i ON pi.image_id = i.id
    WHERE pi.page_id = ? AND pi.image_id = ?;
  `;
  const result = await db.query(selectSql, [pageId, imageId]);
  return result[0]; // assuming result is an array with one element
}

async function deletePageImage(pageId, imageId) {
  const sql = 'DELETE FROM page_images WHERE page_id = ? AND image_id = ?';
  const result = await db.query(sql, [pageId, imageId]);
  return result;
}

module.exports = {
  getAllPageImages,
  createPageImage,
  deletePageImage,
};
