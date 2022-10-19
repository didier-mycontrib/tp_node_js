import fs from 'fs/promises';

async function ajoutFinFichier(){
  try{
      //ajout à la fin (sans saut de ligne par défaut) , si fichier inexistant , un nouveau fichier est créé
      await fs.appendFile('fichierABis.txt', '\ncontenuA');
      console.log("fichierABis créé ou agrandi")
  }catch(err){
    console.error("err="+err);
  }
}
//ajoutFinFichier();

async function ecriturePetitFichier(){
  try{
      await fs.writeFile('fichierB.txt', 'ligne1\nligne2');
      console.log("fichierB généré ou remplacé")
  }catch(err){
    console.error("err="+err);
  }
}
//ecriturePetitFichier();

async function lecturePetitFichier(){
  try{
      let data = await fs.readFile('fichierB.txt');
      console.log("contenu du fichierB = " + data);
  }catch(err){
    console.error("err="+err);
  }
}
//lecturePetitFichier();


async function ouvertureEcritureRelectureFichier(){
  try{
      let file = await fs.open('fichierC.txt', 'w+'); //"w+" : writing and reading
      let buf = Buffer.from('ligne1\nligne2\nligne3');
      let pos = 0,offset = 0, len = buf.length;
      let resWrite = await file.write( buf, offset, len, pos);
      console.log("nb bytes written=" + resWrite.bytesWritten);
      let buf2 = Buffer.alloc(len);
      await file.read( buf2,offset, len, pos); 
      console.log("buf2="+buf2.toString());
      await file.close();
  }catch(err){
    console.error("err="+err);
  }
}
ouvertureEcritureRelectureFichier();



async function manipulationFichier(){
  try{
      await fs.writeFile('fichierD1.txt', 'ligne1\nligne2'); //création de D1
      await fs.copyFile('fichierD1.txt', 'fichierD2.txt'); //copie de D1 vers D2
      await fs.rename('fichierD1.txt', 'fichierD1.old.txt'); //renommer D1 en D1.old
      await fs.mkdir("temp"); //création nouveau répertoire "temp"
      await fs.rename('fichierD2.txt', 'temp/fichierD2.txt'); //deplacer D2 vers temp/D2
      //await fs.unlink("fichierB.txt"); //supression du fichierB.txt
  }catch(err){
    console.error("err="+err);
  }
}
//manipulationFichier();
