CREATE DATABASE IF NOT EXISTS deviseApiDb charset=utf8;
USE deviseApiDb;

CREATE TABLE IF NOT EXISTS Devise(
	code VARCHAR(34) ,
	monnaie VARCHAR(64),
	tauxChange double ,
	PRIMARY KEY(code)) ENGINE=InnoDB;	