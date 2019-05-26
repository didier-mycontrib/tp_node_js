//var mysql = require('mysql'); //ok for sequelize v3 but not sequelize v4 , v5
var mysql = require('mysql2');

var cnx = mysql.createConnection({
  host: "localhost",
  port: "3306",
  database : "minibank_db_node",
  user: "root",
  password: "root"
});

cnx.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  onConnectedToMysqlDB(cnx);
  
});

function onConnectedToMysqlDB(cn){
	crudAdresse(cn);
	//crudClient(cn);
}
	
function crudClient(cn){	
	
	cn.query('INSERT INTO Client SET ?', {prenom: 'Jean' , nom: 'Bon'}, function (error, results, fields) {
       if (error) throw error;
	   var autoIncrId = results.insertId;
       console.log("autoIncrId="+autoIncrId + " " + typeof autoIncrId);
    });
	
	
	//var sql="select * from Client";
	var sql = "select * from Client WHERE numClient!=?";
    cn.query(sql, [1] , function (err, results ) {
		if (err) throw err;
		console.log("Results: " + JSON.stringify(results));
    });
	
	
}
/*
CREATE TABLE Adresse(
	codePostal VARCHAR(64),
	ville VARCHAR(64),
	rue VARCHAR(64),
	idAdr integer auto_increment,
	
	PRIMARY KEY(idAdr)) ENGINE=InnoDB;	
*/
function crudAdresse(cn){
	
	const nouvelleAdresse = { idAdr : null , codePostal: '76000' , ville: 'Rouen' , rue : '123 rue xyz' };
	cn.query('INSERT INTO Adresse SET ?', nouvelleAdresse, function (error, results, fields) {
       if (error) throw error;
	   console.log('In table Adresse, last insert ID:', results.insertId);
    });
	
	cn.query('SELECT * FROM Adresse', function (error, results, fields) {
       if (error) throw error;
	   console.log('list of Adresse:', JSON.stringify(results));
    });
	
	cn.query('UPDATE Adresse SET rue = ? Where idAdr = ?',
			['rue qui va bien', 3], (err, result) => {
				if (err) throw err;
				console.log(`Changed ${result.changedRows} row(s)`);
	});
	
	cn.query('DELETE FROM Adresse WHERE idAdr = ?', [4], (err, result) => {
    if (err) throw err;
     console.log(`Deleted ${result.affectedRows} row(s)`);
    });
	
}