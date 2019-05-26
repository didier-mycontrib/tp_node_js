DROP DATABASE IF EXISTS minibank_db_node;
CREATE DATABASE minibank_db_node charset=utf8;
##CREATE DATABASE IF NOT EXISTS minibank_db_node charset=utf8;
USE minibank_db_node;

DROP TABLE IF EXISTS ClientCompte;
DROP TABLE IF EXISTS Operation;
DROP TABLE IF EXISTS Compte;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Adresse;



######################## CREATE  TABLE ########################################

CREATE TABLE Client (
	nom VARCHAR(64),
	prenom VARCHAR(64),
	numClient integer auto_increment,
	dateNaissance DATE,
	telephone VARCHAR(16),
	email VARCHAR(64),
	ref_adressePrincipale integer,
	password VARCHAR(64),
	PRIMARY KEY(numClient)) ENGINE=InnoDB;	 

CREATE TABLE Adresse(
	codePostal VARCHAR(64),
	ville VARCHAR(64),
	rue VARCHAR(64),
	idAdr integer auto_increment,
	
	PRIMARY KEY(idAdr)) ENGINE=InnoDB;	 


CREATE TABLE Compte(
	label VARCHAR(64),
	numCpt integer auto_increment,
	solde double,
	PRIMARY KEY(numCpt)) ENGINE=InnoDB;	 

CREATE TABLE Operation(
	label VARCHAR(64),
	montant double,
	numOp integer auto_increment,
	dateOp DATE,
	ref_compte integer,
	PRIMARY KEY(numOp)) ENGINE=InnoDB;	 
	
CREATE TABLE ClientCompte(
	numCli integer,
	numCpt integer,
	PRIMARY KEY(numCli,numCpt)) ENGINE=InnoDB;



#######################   FOREIGN KEY       ####################################

ALTER TABLE Client ADD CONSTRAINT Client_avec_adressePrincipale_valide 
FOREIGN KEY (ref_adressePrincipale) REFERENCES Adresse(idAdr);



ALTER TABLE ClientCompte ADD CONSTRAINT ClientCompte_avec_client_valide 
FOREIGN KEY (numCli) REFERENCES Client(numClient);
ALTER TABLE ClientCompte ADD CONSTRAINT ClientCompte_avec_compte_valide 
FOREIGN KEY (numCpt) REFERENCES Compte(numCpt);


ALTER TABLE Operation ADD CONSTRAINT Operation_avec_compte_valide 
FOREIGN KEY (ref_compte) REFERENCES Compte(numCpt);



#########################  INSERT INTO   #####################################

INSERT INTO Adresse (codePostal,idAdr,rue,ville)  VALUES ('75000',1,'2 rue elle','Paris');
INSERT INTO Client (numClient,nom,prenom,dateNaissance,ref_adressePrincipale,password,telephone,email)
              VALUES (1,'Defrance','Didier','1969-07-11',1,'mypwd','0102030405','didier@ici_ou_la');
INSERT INTO Client (numClient,nom,prenom,dateNaissance,ref_adressePrincipale,password,telephone,email)
              VALUES (2,'Therieur','Alex','1969-07-12',1,'mypwd','010900909','alex@ici_ou_la');              
INSERT INTO Compte (label,numCpt,solde) VALUES ('compte courant',1,1200.0);
INSERT INTO Compte (label,numCpt,solde) VALUES ('compte codevi',2,50.0);   
INSERT INTO Compte (label,numCpt,solde) VALUES ('compte 3',3,52.0);  
INSERT INTO Operation (dateOp,label,montant,numOp,ref_compte)  VALUES ('2011-01-20','achat yy',-50.0,1,1);
INSERT INTO Operation (dateOp,label,montant,numOp,ref_compte)  VALUES ('2011-01-21','achat zz',-30.0,2,1);
INSERT INTO ClientCompte (numCli,numCpt) VALUES (1,1);
INSERT INTO ClientCompte (numCli,numCpt) VALUES (1,2);
INSERT INTO ClientCompte (numCli,numCpt) VALUES (2,3);

###################### VERIFICATIONS ###########################################
show tables;
SELECT * FROM Client;
SELECT * FROM Adresse;
SELECT * FROM Compte;
SELECT * FROM Operation;
SELECT * FROM ClientCompte;