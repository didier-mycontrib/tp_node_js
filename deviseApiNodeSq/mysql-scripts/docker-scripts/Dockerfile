FROM mysql:8
# this new image will be create from parent image = mysql:8(stable)

ENV MYSQL_DATABASE=deviseApiDb \
    MYSQL_ROOT_PASSWORD=root
	
ADD schema.sql /docker-entrypoint-initdb.d	

EXPOSE 3306
