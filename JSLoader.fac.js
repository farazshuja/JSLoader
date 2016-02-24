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
