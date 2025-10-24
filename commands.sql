CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES (
  'Luca Seimandi',
  'https://localhost:3000',
  'Not my proudest moment'
);

INSERT INTO blogs (author, url, title) VALUES (
  'Luca Seimandi',
  'https://localhost:3000',
  'Funny enough, my proudest moment'
);

SELECT * FROM blogs; 

\d blogs;