docker container rm -f devise-api-container
docker images rm -f xyz/devise-api
docker image build -t xyz/devise-api  .