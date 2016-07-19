angular.module("ToDoApp",[])

.controller("mainController",function($scope,logicFactory){
    $scope.data = logicFactory.linitializeData();
    $scope.isModalOpen = false;
    $scope.taskListToAdd = "";
    $scope.toggleModal = function(){
      $scope.isModalOpen = !$scope.isModalOpen;
    }
    $scope.addToTask =function(obj){
      if(obj.taskTextToAdd){
        logicFactory.addToTask(obj);
      }
    }

    $scope.deleteTask = function(taskList,index){
      logicFactory.deleteTask(taskList,index);
    }

    $scope.deleteTaskList = function(index){
      logicFactory.deleteTaskList($scope.data,index);
    }

    $scope.toggleStatus = function(task,taskList){
      logicFactory.toggleStatus(task,taskList);
    }

    $scope.addNewTaskList = function(){
      if($scope.taskListToAdd){
        logicFactory.addNewTaskList($scope.data,$scope.taskListToAdd);
        $scope.taskListToAdd = "";
        $scope.toggleModal();
      }
    }
})

.factory("logicFactory",function(dataHandler){
      return {
        linitializeData:function(){
          return dataHandler.dinitializeData();
        },
        addToTask:function(taskList){
          taskList.taskArr.push({taskText:taskList.taskTextToAdd,isDone:false});
          taskList.taskTextToAdd = "";
          dataHandler.saveTaskList(taskList);

        },
        deleteTask:function(taskList,index){
          taskList.taskArr.splice(index,1);
          dataHandler.saveTaskList(taskList);
        },
        toggleStatus: function(task,taskList){
          task.isDone = !task.isDone;
          dataHandler.saveTaskList(taskList);
        },
        addNewTaskList: function(taskListArr,taskListTitle){
          var key = "key_" + (new Date()).getTime();
          var taskList = {
            key:key,
            title:taskListTitle,
            taskArr:[]
          }
          taskListArr.push(taskList);
          dataHandler.saveKeys(taskListArr);
          dataHandler.saveTaskList(taskList);
        },
        deleteTaskList: function(taskListArr,index){
          var key = taskListArr[index].key;
          //taskListArr.splice(index,1);
          dataHandler.removeTaskList(taskListArr.splice(index,1)[0].key);
          dataHandler.saveKeys(taskListArr);
          //dataHandler.removeTaskList(key);


        }
      }

})

.factory("dataHandler",function(initializeData){
  /*Handles data on LOCALSTORAGE Only*/
      return {
        dinitializeData:function(){
          var arrKeys = localStorage.getItem("arrKey");
          if(arrKeys==null){
            initializeData();
            arrKeys = localStorage.getItem("arrKey");
          }
          arrKeys = JSON.parse(arrKeys);
          return arrKeys.map(function(u,i,ar){
            return JSON.parse(localStorage.getItem(u));
          })
        },
        saveTaskList:function(taskList){
          localStorage.setItem(taskList.key,JSON.stringify(taskList));
        },
        saveKeys:function(taskListArr){
          var keyArr = taskListArr.map(function(u,i,ar){
            return u.key;
          });
          localStorage.setItem("arrKey",JSON.stringify(keyArr));
        },
        removeTaskList: function(key){
          localStorage.removeItem(key);
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
      localStorage.setItem("arrKey",JSON.stringify(tlArr_key));
      localStorage.setItem(tlArr_key[0],JSON.stringify(tlObj1));
      localStorage.setItem(tlArr_key[1],JSON.stringify(tlObj2));
      localStorage.setItem(tlArr_key[2],JSON.stringify(tlObj3));
    }
})
