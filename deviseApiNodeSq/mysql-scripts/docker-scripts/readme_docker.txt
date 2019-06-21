#se placer (cd) dans répertoire docker-scripts 
#(où est situé Dockerfile et schema.sql)
su
docker image build -t xyz/devise-db  .
docker image ls
docker run -p 3306:3306 -d --name devise-db-container --network mynetwork --network-alias=devise.db.service xyz/devise-db
docker container ls

=======
docker container exec -ti devise-db-container sh
pour debug :
mysql -u root -p
root
mysql> use deviseApiDb;
mysql> describe Devise;
mysql> exit
exit