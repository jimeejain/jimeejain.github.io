angular.module("taskApp",[])
.controller("mainController",function($scope,logicFactory){
  $scope.tlarr = logicFactory.getInitialData();

  $scope.addTaskList = function(taskLisToAdd){
    if(taskLisToAdd){
      logicFactory.taskLisToAdd(taskLisToAdd,$scope.tlarr);
    };
    $scope.taskLisToAdd = "";
  }
  $scope.deleteTaskList = function(index){
    logicFactory.deleteTaskList(index,$scope.tlarr);
  }
  $scope.addTask = logicFactory.addTask;

   $scope.toggleTaskStatus = logicFactory.toggleTaskStatus
   $scope.deleteTask = function(tl,taskIndex){
     logicFactory.deleteTask(tl,taskIndex);
   }
})
.factory("logicFactory",function(dataHandler){
    return {
      getInitialData: function(){
        return dataHandler.getInitialData();
      },
      deleteTaskList : function(index,tlArr){
        tlArr.splice(index,1);
        var keyArr = tlArr.map(function(u,i,arr){
           return u.key;
        })
        dataHandler.saveTaskKeyArr(keyArr);
      },
      taskLisToAdd: function(taskLisToAdd,tlArr){
        var key = "tlKey_"+(new Date()).getTime();
        var tlObj = {
          key : key,
          title:taskLisToAdd,
          taskArr:[]
        };
        //Save To vaiable :push object
        tlArr.push(tlObj);

        var keyArr = tlArr.map(function(u,i,arr){
           return u.key;
        })
        //Save to localStorage
        //  1. add Key to keyArray
        //  2. Save the object
        dataHandler.saveTasklist(tlObj);
        dataHandler.saveTaskKeyArr(keyArr);

      },
      addTask: function(tl){
        tl.taskArr.push({taskText:tl.taskToAdd});
        tl.taskToAdd = "";
        dataHandler.saveTasklist(tl);
      },
      toggleTaskStatus: function(task,tl){
        task.isDone = !task.isDone;
        dataHandler.saveTasklist(tl);
      },
      deleteTask: function(tl,taskIndex){
        tl.taskArr.splice(taskIndex,1);
        dataHandler.saveTasklist(tl);
      }

    }

})
.factory("dataHandler",function(initializeData){
  return {
    getInitialData: function(){
      var arrKeys = localStorage.getItem("tlArrKey");
       if(arrKeys==null){
         initializeData();
         arrKeys = localStorage.getItem("tlArrKey");
       }
       arrKeys = JSON.parse(arrKeys);
       return arrKeys.map(function(u,i,arr){
           return JSON.parse(localStorage.getItem(u));
       });
    },
    saveTasklist :function(tl){
      localStorage.setItem(tl.key,JSON.stringify(tl));
    },
    saveTaskKeyArr: function(keyArr){
      localStorage.setItem("tlArrKey",JSON.stringify(keyArr));
    }

  }
})


.factory("initializeData",function(){
    return function(){

      var tlArr_key = ["key1","key2","key3"];
      var tlObj1 = {
        key : tlArr_key[0],
        title:"studies",
        taskArr:[{
          taskText:"revise angular",
          isDone:false
        },{
          taskText:"revise js",
          isDone:true
        }]
      };
      var tlObj2 = {
        key : tlArr_key[1],
        title:"office",
        taskArr:[{
          taskText:"defect 5689",
          isDone:false
        },{
          taskText:"defect 45689",
          isDone:false
        }]
      };
      var tlObj3 = {
        key : tlArr_key[2],
        title:"room",
        taskArr:[{
          taskText:"buy groccery",
          isDone:false
        },{
          taskText:"food",
          isDone:true
        }]
      };
      localStorage.clear();
      localStorage.setItem("tlArrKey",JSON.stringify(tlArr_key));
      localStorage.setItem(tlArr_key[0],JSON.stringify(tlObj1));
      localStorage.setItem(tlArr_key[1],JSON.stringify(tlObj2));
      localStorage.setItem(tlArr_key[2],JSON.stringify(tlObj3));
    }


})
