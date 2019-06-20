define({ "api": [
  {
    "type": "get",
    "url": "/deviseApi/rest/public/devises/:code",
    "title": "Request Devise values by code",
    "name": "GetDeviseByCode",
    "group": "deviseApi",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>unique code of Devise (ex: EUR , USD, GBP , JPY)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "devise",
            "description": "<p>devise values as json string</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "devise.code",
            "description": "<p>code of Devise (ex: EUR , USD, GBP , JPY, ...)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "devise.monnaie",
            "description": "<p>name of Devise (ex: euro , dollar , livre , yen)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "devise.tauxChange",
            "description": "<p>change for 1 euro.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\"code\":\"EUR\",\"nom\":\"euro\",\"change\":1}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "List error",
          "content": "HTTP/1.1 500 Internal Server Error\nHTTP/1.1 404 Not Found Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "dist/api/apiRoutes.js",
    "groupTitle": "deviseApi"
  }
] });
