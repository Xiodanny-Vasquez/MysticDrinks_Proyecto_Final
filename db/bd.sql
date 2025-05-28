CREATE DATABASE CocktailDB;
GO

USE CocktailDB;
GO

CREATE TABLE cocktails (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL
);
GO
