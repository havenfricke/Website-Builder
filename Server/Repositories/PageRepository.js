// const db = require('../DB/DbConnection');

// async function getAllPages(params) {
//   let sql = 'SELECT * FROM pages';
//   const conditions = [];
//   const values = [];

//   if (params.id) {
//     conditions.push('id = ?');
//     values.push(params.id);
//   }
//   if (params.title) {
//     conditions.push('title LIKE ?');
//     values.push('%' + params.title + '%');
//   }
//   if (params.content) {
//     conditions.push('content LIKE ?');
//     values.push('%' + params.content + '%');
//   }

//   if (conditions.length > 0) {
//     sql += ' WHERE ' + conditions.join(' AND ');
//   }

//   return await db.query(sql, values);
// }

// async function getPageById(id) {
//   const sql = 'SELECT * FROM pages WHERE id = ?';
//   const result = await db.query(sql, [id]);
//   return result[0]; // return exactly one
// }

// async function createPage(id, body) {
//   const sql = 'INSERT INTO pages (id, title, content) VALUES (?, ?, ?)';
//   await db.query(sql, [id, body.title, body.content]);
//   return { id, title: body.title, content: body.content };
// }

// async function editPage(id, body) {
//   const sql = 'UPDATE pages SET title = ?, content = ? WHERE id = ?';
//   await db.query(sql, [body.title, body.content, id]);
//   return { id, title: body.title, content: body.content };
// }

// async function deletePage(id) {
//   const sql = 'DELETE FROM pages WHERE id = ?';
//   const result = await db.query(sql, [id]);
//   return result; 
// }

// module.exports = {
//   getAllPages,
//   getPageById,
//   createPage,
//   editPage,
//   deletePage
// };


const db = require('../DB/DbConnection');

async function getAllPages(params) {
  let sql = 'SELECT * FROM pages';
  const conditions = [];
  const values = [];

  if (params.id) {
    conditions.push('id = ?');
    values.push(params.id);
  }
  if (params.title) {
    conditions.push('title LIKE ?');
    values.push('%' + params.title + '%');
  }
  if (params.content) {
    conditions.push('content LIKE ?');
    values.push('%' + params.content + '%');
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  return await db.query(sql, values);
}

async function getPageById(id) {
  const sql = 'SELECT * FROM pages WHERE id = ?';
  const result = await db.query(sql, [id]);
  return result[0]; // return exactly one
}

async function createPage(body) {
  const sql = 'INSERT INTO pages (title, content) VALUES (?, ?)';
  await db.query(sql, [body.title, body.content]);
  return { title: body.title, content: body.content };
}

async function editPage(id, body) {
  const sql = 'UPDATE pages SET title = ?, content = ? WHERE id = ?';
  await db.query(sql, [body.title, body.content, id]);
  return { id, title: body.title, content: body.content };
}

async function deletePage(id) {
  const sql = 'DELETE FROM pages WHERE id = ?';
  const result = await db.query(sql, [id]);
  return result; 
}

module.exports = {
  getAllPages,
  getPageById,
  createPage,
  editPage,
  deletePage
};
