-- Active: 1690818895960@@127.0.0.1@3306
-- Active: 1684250178662@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nick_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT "NORMAL" NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);
DROP TABLE users;
SELECT * FROM users;


INSERT INTO users (id, nick_name, email, password, created_at, role)
VALUES
    --senha: Mestre@809030
	("u001", "Priscila Mordente", "priscila@email.com", "$2a$12$Peh3J/B0Ui8VGMbo2rK38uJ2NiDRSrIMLrgWQDGeKUACHnxCdYoPe","2023-02-17T23:50:32.000Z", "ADMIN"),
    --senha: arya@208090
	("u002", "Arya Stark", "arya@email.com", "$2a$12$y22Usjg0R467BPkQ8tclUOZiLHUr2v/WAEoJylt64WZna4LCV/lyS", "2023-02-17T23:50:32.000Z", "NORMAL"),
    --senha: snow@3980
    ("u003", "João das Neves", "joao@email.com", "$2a$12$1lGzN/XboaHOwmBfzvONj.yS20YDyYbYehBgAyj9sZRlVA//.JDZu", "2023-02-17T23:50:32.000Z", "NORMAL"),
    --senha: dracarys@30698
    ("u004", "Dany Targaryen", "dany@email.com", "$2a$12$j7rs.lW9xGG86bkO98OLvOdCnxTwrq2IxTNKT4oc0uE6Zb6OergKi", "2023-02-17T23:50:32.000Z", "NORMAL");

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT  NULL,
  creator_id TEXT NOT  NULL,
  content TEXT NOT  NULL,
  likes INTEGER NOT  NULL,
  dislikes INTEGER NOT  NULL,
  replies INTEGER DEFAULT(0) NOT NULL,
  created_at TEXT DEFAULT (DATETIME('now')) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME('now')) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE

);

INSERT INTO posts (id, creator_id, content, likes, dislikes, replies, created_at, updated_at)
VALUES
	("p001", "u001", "Backend é melhor que frontend", 0, 0, 1, "2023-02-17T23:50:32.000Z", "2023-02-17T23:50:32.000Z"),
	("p002", "u002", "O que dizemos para o Deus da morte?", 0, 1, 1, "2023-02-17T23:50:32.000Z", "2023-02-17T23:50:32.000Z"),
	("p003", "u003", "Não sei de nada!", 3, 1, 1, "2023-02-17T23:50:32.000Z", "2023-02-17T23:50:32.000Z"),
	("p004", "u004", "Dracarys!", 1, 0, 1, "2023-02-17T23:50:32.000Z", "2023-02-17T23:50:32.000Z");
DROP TABLE posts;

CREATE TABLE likes_dislikes_post (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    "like" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE likes_dislikes_post;

--populando as seguintes tabelas: users, posts e likes_dislikes



CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes_post_comment (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    likes INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE posts;



DROP TABLE likes_dislikes;
--verificando as tabelas
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM likes_dislikes;

