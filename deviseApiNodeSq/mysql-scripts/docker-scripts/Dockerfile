FROM mysql:5.7
# this new image will be create from parent image = mysql:5.7(stable and compatible with nodeJs mysql2 client)

ENV MYSQL_DATABASE=deviseApiDb \
    MYSQL_ROOT_PASSWORD=root
	
ADD schema.sql /docker-entrypoint-initdb.d	

EXPOSE 3306
