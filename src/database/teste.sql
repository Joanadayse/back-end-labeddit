-- Active: 1687350171833@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);


DROP TABLE users;

SELECT * FROM users;

CREATE TABLE post(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL ,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at  TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

DROP TABLE post;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    "like" INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(id) 
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE posts_comments(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        deslikes INT NOT NULL DEFAULT 0,
        comments  TEXT PRIMARY KEY NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES post(id)
    );

    DROP TABLE posts_comments;


    SELECT * FROM posts_comments;

    INSERT INTO posts_comments (user_id, post_id, deslikes, comments) VALUES
    ("96397cc2-6ae2-4def-98d6-6abdb1ca2f64","8d9f11f5-4cdb-4247-a923-e574286d3da3", 0, "curti seu post");

CREATE TABLE
    likes_dislikes_comments(
        user_id INT NOT NULL,
        comments TEXT NOT NULL,
        "like" INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comments) REFERENCES posts_comments(comments)
    );

    SELECT * FROM post
     INNER JOIN posts_comments on post.id= posts_comments.post_id; 



