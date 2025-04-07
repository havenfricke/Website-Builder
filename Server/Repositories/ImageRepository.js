const db = require("../DB/DbConnection");

async function getAllImages(params){
    let sql = 'SELECT * FROM images';
    return await db.query(sql);
}

async function getImageById(id) {
    const sql = 'SELECT * FROM images WHERE id = ?';
    const results = await db.query(sql, [id]);
    // If your query returns an array of results, return the first element.
    return results.length ? results[0] : null;
  }

async function createImage(id, body) {
    const sql = 'INSERT INTO images (id, title, alt_text, content) VALUES (?, ?, ?, ?)';
    await db.query(sql, [id, body.title, body.altText, body.content]);
    return { id, title: body.title, altText: body.altText, content: body.content };
}

async function editImage(id, body){
      const sql = 'UPDATE images SET title = ?, alt_text = ?, content = ? WHERE id = ?';
      await db.query(sql, [body.title, body.altText, body.content, id]);
      return { id, title: body.title, altText: body.altText, content: body.content };
}

async function deleteImage(id) {
  const sql = 'DELETE FROM images WHERE id = ?';
  const result = await db.query(sql, [id]);
  return result; 
}

module.exports = {
    getAllImages,
    getImageById,
    createImage,
    editImage,
    deleteImage
}