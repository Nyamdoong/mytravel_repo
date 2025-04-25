CREATE DATABASE travel_mbti;

USE travel_mbti;

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    type1 CHAR(1) NOT NULL,
    type2 CHAR(1) NOT NULL
);

CREATE TABLE results (
    mbti VARCHAR(3) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    tips TEXT
);
