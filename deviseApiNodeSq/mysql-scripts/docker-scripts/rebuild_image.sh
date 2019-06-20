docker container rm -f devise-db-container
docker images rm -f xyz/devise-db
docker image build -t xyz/devise-db  .