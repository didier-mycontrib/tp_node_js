const fs = require('fs');

//ajout à la fin (sans saut de ligne par défaut) , si fichier inexistant , un nouveau fichier est créé
fs.appendFile('fichierA.txt', '\ncontenuA', 
      function (err) {   
        if (err) throw err;   
        console.log('fichierA créé ou agrandi !');
    });

/*
fs.open('nouveauFichier.txt', 'w+', 
        (err, fd) => {   
            let buf = Buffer.from('Mon nouveau contenu');
            let pos = 0,offset = 0, len = buf.length; 
            fs.write(fd, buf, offset, len, pos, 
                (err,bytes,buff) => {      
                    let buf2 = Buffer.alloc(len);      
                    fs.read(fd,buf2,offset, len, pos,
                        (err,bytes,buff2) => {        
                            console.log('Fichier mis à jour !');      
                        });    
                    });
                });    
*/