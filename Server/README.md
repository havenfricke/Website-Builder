# Server
- npm i 
- node entry.js
- Fill in DB info in .env
- multer, node, and mysql2


## MySQL to set up pages table:

- Once a MySQL DB is set up use `mysqlsh`
- Then, `\connect username@host:port`. mysql shell will ask for the password. Mine is root@localhost:3306.
- `USE database_name`

### Configuration

`CREATE TABLE pages (
  id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);`

`CREATE TABLE images (
id VARCHAR(50) PRIMARY KEY,
title VARCHAR(255),
alt_text VARCHAR(255),
content LONGBLOB
);`

`CREATE TABLE page_images (
  page_id VARCHAR(50) NOT NULL,
  image_id VARCHAR(50) NOT NULL,
  PRIMARY KEY (page_id, image_id),
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);`