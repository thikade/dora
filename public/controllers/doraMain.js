﻿/// <reference path="../angular.js" />

//angular.module("sportsStore")
//angular.module("sportsStore", ["customFilters", "cart" ]);

//declare module
//angular.module("sportsStore", ["customFilters", "cart", "ngRoute"])
angular.module("dora", [ "customFilters", "ngRoute", 'angular-loading-bar', 'ngAnimate' ])

    .config(function ($routeProvider) {

        $routeProvider.when("/other", {
            templateUrl: "/views/doraPlaceholder.html"
        });

        $routeProvider.when("/setup", {
            templateUrl: "/views/doraSetupView.html"
        });

        $routeProvider.when("/create/droplet", {
            templateUrl: "/views/doraCreateDropletView.html"
        });

        $routeProvider.otherwise({
            templateUrl: "/views/doraMainView.html"
        });

    });


//configure module
angular.module("dora")

.constant("doApiCfg",
    {
        "myTestToken"      : "0c921cd3369f5513557486ad1009f25ad1e4bbb58abaa43d12169abbf313cbdc",
        "doApiBaseUrl"     : "https://api.digitalocean.com",
        "doApiCmdImages"   : "v2/images",
        "doApiCmdDroplets" : "v2/droplets",
        "doApiCmdActions"  : "v2/actions",
        "doApiCmdRegions"  : "v2/regions",
        "doApiCmdSizes"    : "v2/sizes",
        "doApiCmdSSHKeys"  : "v2/account/keys",
        "doApiParamSnapshots" : "type=snapshot&private=true"
    })

.controller("DoraMainController", function ($scope, $http, $location, doApiCfg ) {

// store token in localstorage: http://html5doctor.com/storing-data-the-simple-html5-way-and-a-few-tricks-you-might-not-have-known/

    $scope.consoleLog = function (msg) {
        console.log(msg);
    };

    $scope.consoleLog("doApiBaseUrl: "+ doApiCfg.doApiBaseUrl);
    
    var httpConfig = {
            headers:  {
                //'Authorization': 'Bearer ' + doApiCfg.myTestToken,
                'Accept': 'application/json',
                "X-Testing" : "testing"
            }
    };


    $scope.data = {};
    //$scope.data.droplets = [];
    $scope.data.bearerToken = undefined;
    $scope.data.apiResponse = {};
    $scope.data.newDroplet  = { keys: {}, keyNames: [] };
    $scope.data.error = null;

    $scope.data.validation = { result : null };

    $scope.navigation = { selectedMenuButton: "" };


    $scope.updateHTTPConfigAuthorization = function (token) {
        httpConfig.headers.Authorization = 'Bearer ' +  token;
        //$scope.consoleLog(angular.toJson(httpConfig.headers,true));

    };

    $scope.storeToken = function () {
        localStorage.setItem("DOToken", $scope.data.bearerToken);
        $scope.consoleLog("token saved to localStorage");
    };

    // get token from locastorage and store as bearer token &  update httpConfig
    $scope.retrieveToken = function () {
        var tmpToken = localStorage.getItem("DOToken");
        $scope.consoleLog("retrieving Token");
        if (tmpToken) {
            $scope.consoleLog("token found in localStorage: " + tmpToken);
            $scope.data.bearerToken = tmpToken;
            $scope.updateHTTPConfigAuthorization(tmpToken);
        }
        else {
            $scope.consoleLog("token not found!");
            tmpToken = null;
        }
        return tmpToken;
    };

    $scope.deleteToken = function () {
        var tmpToken = $scope.retrieveToken();
        if (tmpToken) {
            localStorage.removeItem("DOToken");
            $scope.consoleLog("token deleted from localStorage");
        }
        else {
            $scope.consoleLog("token not found in localStorage");
        }
            
    };

    $scope.dropletsExist = function() {
        var d = $scope.data.apiResponse.droplets;
        if (d && d.droplets.length > 0) {
            return true;
        }
        return false;
    };

    // validate and store token in localstorage
    $scope.tokenValidation = function () {
        $scope.updateHTTPConfigAuthorization($scope.data.bearerToken);
        var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdRegions;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("token validation ok");
                $scope.data.validation.result = "Token verified";
                $scope.storeToken($scope.data.bearerToken);
                $scope.consoleLog("token stored locally");
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.data.validation.result = "Error during token verification!";
                $scope.consoleLog("token verification error,  returned: " + error);
                $scope.consoleLog("token NOT stored!");
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };

    $scope.getDOPrivateSnapshots = function() {
       var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdImages + "?" + doApiCfg.doApiParamSnapshots ;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("getDOPrivateSnapshots ok");
                $scope.data.apiResponse.privateSnapshots = data;
                // $scope.consoleLog("images returned: " + angular.toJson(data,true));
                // for (var i=0; i < data.images.length; i++ ) {
                //     $scope.consoleLog("ss: " + data.images[i].name);
                // }
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.consoleLog("getDOPrivateSnapshots error returned: " + error);
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };

    $scope.getDODroplets = function() {
       var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdDroplets;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("getDODroplets ok");
                $scope.data.apiResponse.droplets = data;
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.consoleLog("getDODroplets error returned: " + error);
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };
    $scope.getDOSizes = function() {
       var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdSizes;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("getDOSizes ok");
                $scope.data.apiResponse.sizes = data;
                // for (var i=0; i < data.sizes.length; i++ ) {
                //     $scope.consoleLog("ss: " + data.sizes[i].slug);
                //}
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.consoleLog("getDOSizes error returned: " + error);
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };

   $scope.getDORegions = function() {
       var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdRegions;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("getDORegions ok"); //+angular.toJson(data,true));
                $scope.data.apiResponse.regions = data;
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.consoleLog("getDORegions error returned: " + error);
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };

   $scope.getDOKeys = function() {
       var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdSSHKeys;
        $http.get(url, httpConfig)
            .success(function (data) {
                $scope.consoleLog("getDOKeys ok"); //+angular.toJson(data,true));
                $scope.data.apiResponse.sshkeys = data;
            })
            .error(function (error) {
                $scope.data.apiError = error;
                $scope.consoleLog("getDOKeys error returned: " + error);
            })
            .finally(function () {
                //$location.path("/complete");
            });
    };


    $scope.dropletNameFromSnapshotName = function(name) {
        var pos = name.indexOf("_");
        if (pos < 0) {
            pos = name.indexOf("-");
        }
        if (pos < 0) {
            pos = name.indexOf(".");
        }
        if (pos < 0) {
            pos = name.indexOf(" ");
        }
        if (pos < 0) {
            return "unspecified";
        }
        return name.slice(0,pos);
    };

    $scope.setSnapshotForNewDroplet = function(o) {
        $scope.consoleLog("new droplet: snapshot is: " + o.name + "  ( " + o.id + " )");
        $scope.data.newDroplet.snapshot = { name: o.name, id: o.id };
        $scope.data.newDroplet.dropletName = $scope.dropletNameFromSnapshotName(o.name);
    };

   $scope.setRegionForNewDroplet = function(o) {
        $scope.consoleLog("new droplet: region is: " + o.name + " ( " + o.slug + " )");
        $scope.data.newDroplet.region = { name: o.name, id: o.slug};
    };

   $scope.setSizeForNewDroplet = function(name) {
        $scope.consoleLog("new droplet: size is: " + name);
        $scope.data.newDroplet.size = name;
    };

   $scope.newDropletKeyIsSelected = function(keyName) {
        var keyIDs = Object.keys($scope.data.newDroplet.keys);
        for (var i=0; i < keyIDs.length; i++) {
            var k = keyIDs[i];
            var v = $scope.data.newDroplet.keys[k];
            if (v === keyName ) {
                return true;
            }
        }
        return false;
    };

    $scope.setKeysForNewDroplet = function(o) {
        //console.log("setKeysForNewDroplet");
        $scope.consoleLog("new droplet: toggling key : " + o.id + "( " + o.name + " )");
        //toggle key, if already there, delete key
        if ($scope.data.newDroplet.keys[o.id]) {
            delete $scope.data.newDroplet.keys[o.id];
        }
        else {
            $scope.data.newDroplet.keys[o.id] = o.name;
        }
        // now compute the key Name string for display
        var keyIDs = Object.keys($scope.data.newDroplet.keys);
        //console.log("keyIDs Json: " + angular.toJson(keyIDs));
        
        $scope.data.newDroplet.keyNameString = "";
        for (var i=0; i < keyIDs.length; i++) {
            var k = keyIDs[i];
            var v = $scope.data.newDroplet.keys[k];
            //console.log("adding key:" + k + " / " + v);
            $scope.data.newDroplet.keyNameString =
                $scope.data.newDroplet.keyNameString + " " + v;
        }
        //console.log("final keystring:" + $scope.data.newDroplet.keyNameString);
    };

    $scope.newDropletDefinitionComplete = function() {
        var d = $scope.data.newDroplet;
        var keysDefined = false;
        var sizeDefined = false;
        var regionDefined = false;
        var snapshotDefined = false;

        if ( angular.isDefined(d.keys) && Object.keys(d.keys).length > 0 ) { keysDefined = true;}
        if ( angular.isDefined(d.size) ) { sizeDefined = true;}
        if ( angular.isDefined(d.snapshot) ) { snapshotDefined = true;}
        if ( angular.isDefined(d.region) ) { regionDefined = true;}

        // $scope.consoleLog("----------------");
        // $scope.consoleLog("keysDefined    : "+ keysDefined);
        // $scope.consoleLog("sizeDefined    : "+ sizeDefined);
        // $scope.consoleLog("regionDefined  : "+ regionDefined);
        // $scope.consoleLog("snapshotDefined: "+ snapshotDefined);
        // $scope.consoleLog("----------------");
        if ( keysDefined && sizeDefined && regionDefined && snapshotDefined) {
            return true;
        } else {
            return false;
        }

    };

    $scope.createNewDroplet = function() {
        $scope.data.newDroplet.id = undefined;

        $scope.consoleLog(" ---- creating new droplet ----");
        $scope.consoleLog("     " + "name:      " + $scope.data.newDroplet.dropletName);
        $scope.consoleLog("     " + "snapshot:  " + angular.toJson($scope.data.newDroplet.snapshot));
        $scope.consoleLog("     " + "region:    " + angular.toJson($scope.data.newDroplet.region));
        $scope.consoleLog("     " + "size:      " + $scope.data.newDroplet.size);
        $scope.consoleLog("     " + "keys:      " + angular.toJson($scope.data.newDroplet.keys));
        $scope.consoleLog(" ---- creating new droplet ----");
        // create Object for POST request 
        // { "name": "dockerer2", "region": "fra1", "size": "1gb", "image": 13931724, "ssh_keys": [ 998948, 998949 ], "backups": "false" }

        var newDroplet = {
            "name"    : $scope.data.newDroplet.dropletName,
            "image"   : $scope.data.newDroplet.snapshot.id,
            "region"  : $scope.data.newDroplet.region.id,

            "size"    : $scope.data.newDroplet.size,
            "ssh_keys": Object.keys( $scope.data.newDroplet.keys ),
            "backup"  : false
        };
        $scope.consoleLog("POST body START -------");
        $scope.consoleLog(angular.toJson(newDroplet,true) );
        $scope.consoleLog("POST body END   -------");
        
        $scope.consoleLog("");

        var url = doApiCfg.doApiBaseUrl + "/" + doApiCfg.doApiCmdDroplets;
        $http.post(url, newDroplet, httpConfig)
            .success(function (response) {
                $scope.consoleLog("createDroplet success!");
                $scope.consoleLog("response : "  + angular.toJson(response, true));
                $scope.data.newDroplet.id = response.droplet.id;
            })
            .error(function (errResponse) {
                $scope.data.apiError = errResponse;
                $scope.consoleLog("createDroplet error : " + angular.toJson(errResponse, true));
            })
            .finally(function () {
                //$location.path("/complete");
            });

        $scope.consoleLog("");
    };

    $scope.oSort = function (o, sortkey) {
        var idxArray = o.sort( function(x, y) {
            console.log("x: " + x + " / y: " +y);
            console.log("a(x): " + a[x].name + "  / " + "a(y): " + a[y].name);
            return ((a[x].name) > (a[y].name));
        });
        var newArray = [];
        for (var i=0; i <  idxArray.length; i++) {
            var idx = idxArray[i];
            newArray.push( o[idx] );
        }
    return newArray;
    };

    // ===========================
    // main init
    // ===========================

    $scope.retrieveToken();
    if ($scope.data.bearerToken) {
        $scope.navigation.selectedMenuButton = "info";
        $scope.getDODroplets();
        $scope.getDOPrivateSnapshots();
        $scope.getDOSizes();
        $scope.getDORegions();
        $scope.getDOKeys();
        $location.path("/info");
    }
    else {
        // no token stored -> got to setup
        $scope.navigation.selectedMenuButton = "setup";
        $location.path("/setup");
    }
});
