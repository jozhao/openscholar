(function () {
  var rootPath = Drupal.settings.osRestModulePath,
      restPath = Drupal.settings.restBasePath;

  angular.module('mediaBrowser', [])
  /**
   * Service to maintain the list of files on a user's site
   */
  .factory('FileService', ['$rootScope', '$http', function ($rootScope, $http) {
    var files = [];
    $http.get(restPath+'/file')
      .success(function success(data) {
        files = data.list;
        $rootScope.$broadcast('FileService.changed', files);
      })
      .error(function errorFunc() {
        $http.get({url: restPath}).
          success(success).
          error(errorFunc);
      });

    return {
      getAll: function () {
        return files;
      },
      add: function (file) {
        files.push(file);
        $rootScope.$broadcast('FileService.changed', files);
      },
      edit: function (file) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].fid == file.fid) {
            files[i] = file;
            $rootScope.$broadcast('FileService.changed', files);
            return true;
          }
        }
        return false;
      },
      delete: function (fid) {
        if (angular.isObject(fid)) {
          fid = fid.fid;
        }
        for (var i = 0; i < files.length; i++) {
          if (files[i].fid == fid) {
            files.splice(i, 1);
            $rootScope.$broadcast('FileService.changed', files);
            return true;
          }
        }
        return false;
      }
    };
  }]).
  /**
   * Sets up paths for when the
   */
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/browser/upload', {
        templateUrl: rootPath+'/templates/upload.html',
        controller: 'UploadCtrl'
      }).
      when('browser/internet', {
        templateUrl: rootPath+'/templates/internet.html',
        controller: 'InternetCtrl'
      }).
      when('/browser/list', {
        templateUrl: rootPath+'/templates/browser.html',
        controller: 'BrowserCtrl'
      }).
      when('/browser/edit/:fileId', {
        templateUrl: rootPath+'/templates/fileEdit.html',
        controller: 'FileEditCtrl'
      }).
      otherwise({
        redirectTo: '/browser/list'
      });
  }]).
  controller('BrowserCtrl', ['FileService', '$scope', '$filter', function (FileService, $scope, $filter) {
    $scope.files = FileService.getAll();

    $scope.$on('FileService.changed', function (event, files) {
      $scope.files = files;
    });

    $scope.queryFilename = function (item) {
      if ($scope.search) {
        if (item.name.indexOf($scope.search) > -1) {
          return true;
        }
        else if (item.orig.indexOf($scope.search) > -1) {
          return true;
        }
        return false;
      }
      return true;
    };

    var currentPage = 0;
    $scope.currentPage = function () {
      return Math.min(currentPage, $scope.numberOfPages()-1);
    };
    $scope.setCurrentPage = function (p) {
      currentPage = p;
    };
    $scope.pageSize = 10;
    $scope.numberOfPages = function () {
      return Math.ceil($filter('filter')($scope.files, $scope.queryFilename).length/$scope.pageSize);
    };


  }]).
  filter('start', function () {
    return function (input, start) {
      start = +start;
      return input.slice(start);
    }
  });
})();