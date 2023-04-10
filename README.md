# JSLoader
Dynamically load javascript files before running the controller. This loader use the jquery method $.getScript(), so you must include jQuery in the project..

## Usage in Controller
```javascript
angular.module('myApp')
  .controller('myController', ['JSLoader', function(JSLoader) {
    var scripts = ['/to/path/script1.js', '/to/path/script2.js', '/to/path/script3.js'];
    JSLoader.load(scripts).then(function success() {
      //custom scripts loaded and cached, now u can used them
    }, function error() {
      //one or all of the script was not loaded
    });
  });
```

## Usage in Router's Resolve
This is the better approach to resolve scripts inside router
```javascript
.when('/my/web/page', {
	templateUrl: url/to/template,
	controller: myController,
	resolve: {
		Types: ['$resource', function($resource) {
			$resource('some/static/data').get().$promise
		})],
		Scripts: ['JSLoader', function(JSLoader) {
			var scripts = ['/to/path/script1.js', '/to/path/script2.js', '/to/path/script3.js'];
			return JSLoader.load(scripts);
		}];
	}
};
```
and now before loading the view for myController, all Scripts will be loaded.

## JSLoader Factory
```javascript
(function() {
    angular.module('myApp')
		.factory('JSLoader', ['$q', function($q) {
			var cache = [];
			var load = function(src) {
				var deferred = $q.defer();
				var srcArr = [];
				if(typeof src == 'string') {
					srcArr.push(src);
				}
				else {
					srcArr = src;
				}
				resolveScript(src, deferred);
				return deferred.promise;
			};

			var resolveScript = function(srcArr, deferred) {
				if(srcArr.length != 0) {
					var src = srcArr.shift();
					if(cache.indexOf(src) != -1) {
						resolveScript(srcArr, deferred);
						return;
					}
					$.getScript(src).done(function() {
						cache.push(src);
						resolveScript(srcArr, deferred);
					}).fail(function() {
						deferred.reject({error: true});
					});
				}
				else {
					cache.push(src);
					deferred.resolve({success: true});

				}
			}

			return {
				load: load
			}
		}]);
})();
```
