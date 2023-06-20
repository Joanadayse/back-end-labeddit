-- Active: 1687199405392@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES
  -- tipo NORMAL e senha = fulano123
	('u001', 'Fulano', 'fulano@email.com', '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC', 'NORMAL'),

  -- tipo NORMAL e senha = beltrana00
	('u002', 'Beltrana', 'beltrana@email.com', '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2', 'NORMAL'),

  -- tipo ADMIN e senha = astrodev99
	('u003', 'Astrodev', 'astrodev@email.com', '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.', 'ADMIN');


SELECT * FROM users;
    CREATE TABLE post(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL ,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    create_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at  TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO post(id, creator_id, content, likes, dislikes) VALUES
("b90", "u001", "Hoje é um bom dia", 2,0),
("b91", "u002", "Hoje é domingo", 10,1),
("b93", "u003", "bom dia", 20,1);

DROP TABLE post;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE 
      ON UPDATE CASCADE
    ON DELETE CASCADE
);

DROP TABLE likes_dislikes;