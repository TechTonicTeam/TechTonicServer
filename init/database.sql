CREATE TABLE users (
    id SERIAL PRIMARY key,
    name VARCHAR(128),
    email VARCHAR(128),
    picture VARCHAR(128),
    password VARCHAR(256)
);

CREATE TABLE tokens (
    user_id INT NOT NULL,
    token TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY key,
    title VARCHAR(128),
    picture VARCHAR(256),
    timestamp VARCHAR(128),
    user_id INT NOT NULL,
    likes INT,
    FOREIGN KEY (user_id) references users(id)
);


CREATE TABLE likedPost (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (user_id) references users(id),
    FOREIGN KEY (post_id) references posts(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY key,
    title VARCHAR(256),
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    timestamp VARCHAR(128),
    likes INT,
    FOREIGN KEY (post_id) references posts(id),
    FOREIGN KEY (user_id) references users(id)
);

CREATE TABLE likedComment (
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (comment_id) references comments(id),
    FOREIGN KEY (user_id) references users(id)
);

INSERT INTO users (name, email) VALUES ('Рябичев Максим Максимович', 'n3wers@gmail.com');
