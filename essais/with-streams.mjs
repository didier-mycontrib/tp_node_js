import fs from 'fs';
import fsp from 'fs/promises';

function simpleStream(){
    let writeStream = fs.createWriteStream('fichierF.txt');
    writeStream.write('Mon contenu de flux', 'utf-8');
    writeStream.write('\nMon contenu2 de flux', 'utf-8');
    //NB: finish event will be fired when calling .end()
    writeStream.on('finish', () => {   console.log('fichierF mis à jour !');});
    writeStream.end();
}
simpleStream();

async function copierFichierViaStreams(){
    try{
        await fsp.writeFile('fichierE1.txt', 'ligne1\nligne2'); //création de E1
        //fs.createReadStream('fichierE1.txt').pipe(fs.createWriteStream('fichierE2.txt'));//copie de E1 en E2
        let fileE1 = await fsp.open('fichierE1.txt', 'r');
        let fileE2 = await fsp.open('fichierE2.txt', 'w');
        fileE1.createReadStream().pipe(fileE2.createWriteStream());
    }catch(err){
      console.error("err="+err);
    }
  }
  copierFichierViaStreams();