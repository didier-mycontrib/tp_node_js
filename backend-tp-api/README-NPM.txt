npm install -s express
npm install -s tslib

npm install --save-dev @types/express
npm install --save-dev @types/node  
npm install --save-dev chai
npm install --save-dev chai-http
npm install --save-dev mocha
npm install --save-dev @types/chai
npm install --save-dev @types/chai-http
npm install --save-dev @types/mocha


#NB: sqlite3 (compatible sequelize) est une minibase embarquée au format SQL
# un peu équivalent à h2 du monde java


npm install -s mongoose
npm install --save-dev @types/mongoose
npm install -s mongoose-auto-increment (optional plugin)
npm install --save-dev @types/mongoose-auto-increment


Need of "skipLibCheck": true, in tsconfig.json due to errors in @types/mongoose .

npm install -s sequelize
npm install --save-dev @types/sequelize
npm install -s sqlite3

npm install -s jsonwebtoken
npm install --save-dev @types/jsonwebtoken

npm install -s express-fileupload
npm install --save-dev @types/express-fileupload

ou bien 

npm install (avec git clone)


===============
#NB: nedb (node embedded db) etait (jusqu'en 2017) une minibase de données embarquée
# ressemblant à mongodb (pratique pour mini-besoins ou bien tests)
npm install -s nedb
npm install --save-dev @types/nedb

La technologie nedb n'est plus maintenue
--> code et dépendance nedb supprimé en 2021

===========
NB: le code generic en version sqlite n'a été que peu testé.

====
depuis le 05/05/2021 , les anciennes versions "mongo sans mongoose"
et "sqlite sans sequelize" ont été abandonnées pour céder La
place à de nouvelles versions basées sur mongoose et sequelize.

les dépendances suivantes ont donc été supprimées:

npm install -s mongodb
npm install --save-dev @types/mongodb

npm install -s sqlite3
npm install --save-dev @types/sqlite3