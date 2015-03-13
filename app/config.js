System.config({
  "baseURL": "/ecma-angular/app",
  "paths": {
    "*": "*.js",
    "bower:*": "jspm_packages/bower/*.js"
  }
});

System.config({
  "map": {
    "angular": "bower:angular@1.3.14",
    "angular-route": "bower:angular-route@1.3.14",
    "eswebapiangularjs": "bower:eswebapiangularjs@0.0.44",
    "bower:angular-route@1.3.14": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:angular-sanitize@1.3.14": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:eswebapiangularjs@0.0.44": {
      "angular-sanitize": "bower:angular-sanitize@1.3.14",
      "angularjs": "bower:angularjs@1.3.14",
      "log4javascript": "bower:log4javascript@1.4.9",
      "ngstorage": "bower:ngstorage@0.3.0",
      "stacktrace-js": "bower:stacktrace-js@0.6.4",
      "underscore": "bower:underscore@1.7.0"
    },
    "bower:ngstorage@0.3.0": {
      "angular": "bower:angular@1.3.14"
    }
  }
});

