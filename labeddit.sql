-- Active: 1690477182985@@127.0.0.1@3306
-- Active: 1684250178662@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL ,
  name TEXT  NOT NULL,
  email TEXT  NOT  NULL,
  password TEXT NOT  NULL,
  role TEXT NOT NULL 
);
DROP TABLE users;

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT  NULL,
  creator_id TEXT NOT  NULL,
  content TEXT NOT  NULL,
  likes INTEGER NOT  NULL,
  dislikes INTEGER NOT  NULL,
  created_at TEXT DEFAULT (DATETIME('now')) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME('now')) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE

);
DROP TABLE posts;

CREATE TABLE likes_dislikes (
  user_id TEXT NOT  NULL,
  post_id TEXT NOT  NULL,
  "like" INTEGER NOT  NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE
);

DROP TABLE likes_dislikes;

--populando as seguintes tabelas: users, posts e likes_dislikes



CREATE TABLE comment(
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE

);

INSERT INTO comment VALUES 
("949b4412-7ff1-4645-b185-577a9d5a9002","7facac1b-ffb4-4c31-a104-9cbe16e8f1b7", "muito bom !");

SELECT * FROM posts INNER JOIN comment
ON comment.post_id= posts.id; 


DROP TABLE posts;



DROP TABLE likes_dislikes;
--verificando as tabelas
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM likes_dislikes;

