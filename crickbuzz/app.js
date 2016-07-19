angular.module("cricApp",[])

.factory("cricFactory",function($http){
   return {
     getData :function(){
       return $http({
           method:"GET",
           url:"http://jsonplaceholder.typicode.com/posts"
         })
     }
   }
})

.controller("mainController",function($scope,cricFactory){
    cricFactory.getData().then(function(response){
      $scope.data = response.data;
      console.log($scope.data)
    },function(error){
      console.error(error);
    })

})
