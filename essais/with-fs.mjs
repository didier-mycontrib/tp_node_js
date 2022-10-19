import fs from 'fs';
//ajout à la fin (sans saut de ligne par défaut) , si fichier inexistant , un nouveau fichier est créé
fs.appendFile('fichierA.txt', '\ncontenuA', 
      function (err) {   
        if (err) throw err;   
        console.log('fichierA créé ou agrandi !');
    });