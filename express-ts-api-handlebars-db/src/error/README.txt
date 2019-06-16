classes d'erreurs/exceptions :
  - remontées par Promise.reject() par les dataServices (ex: sequelize , mongo, ...)
  - analysées par les controleurs d'api REST de manière à bien retourner les status appropries (ex: NOT_FOUND , ...)