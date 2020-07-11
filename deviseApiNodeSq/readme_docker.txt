NB:Cette application NodeJs (REST backend-tp-api) 
s'appuie en interne sur une base de données mongodb
=================================================================
Construction de l'image et du conteneur docker pour "node_express":
----------------------------------------------->
#se placer (cd) dans répertoire ... 
#(où est situé Dockerfile et package.json)
su
docker image build -t xyz/node_express  .
docker image ls
docker run -p 8282:8282 -d --name node_express_container --network mynetwork --network-alias=backend.api.service xyz/node_express
docker container ls

=======
docker container exec -ti devise-api-container sh
pour debug :
ping -c 2 devise.db.service
exit
