/*
localStorage will be used to store all the data.

Step 1:
  starting Point: get the list of taskList_Keys
  taskListKey : [taskList1_key,taskList2_key,taskList3_key]
Step 2:
  Use a Loop to get all the taskList using the key received from Step 1
  Store that in an array after parsing the string received

  Storage Structure:
    taskList1_key : stringified object
    taskList2_key : stringified object

For modification etc,
  Update the corresponsding taskListX_key

Object Structure for the taskList Object

  {
    "key":"taskList keys" //Task List keys used to store the stringified object
    "title":"Task list for XYZ"
    "colorCode":"#XXYYZZ"
    taskList:[
      {
        "taskText":"whatever you want to do",
        "isDone":boolean
      }, .... multiple objects
    ]
  }


*/

angular.module("taskList",[])
.constant("taskListConfig",{
  taskListsKey:"taskListsKey",
  defaultColorClass:"w3-grey"
})
.factory("dataStore",function(){
  return {
    tlArr:[],
    tlKeyArr:[]
  }
})
.factory("StoreManager",["dataStore","taskListConfig","dummyDataInitialization",function(dataStore,tlconfig,dummyDataInitialization){
  /*Performs CRUD operation on localStorage*/
  return {
    getValue:function(key){
      return localStorage.getItem(key);
    },
    setValue:function(key,value){
      localStorage.setItem(key,value)
    },
    removeKey:function(key){
      localStorage.removeItem(key);
    },
    saveModifiedTaskList:function(tlIndex){
      this.setValue(dataStore.tlArr[tlIndex].key , JSON.stringify(dataStore.tlArr[tlIndex]))
    },
    reset:function(){
      dataStore.tlArr = [];
      dataStore.tlKeyArr = [];
      dummyDataInitialization.initializeDummyData();
    },
    getTaskList:function(){
      /*
        Get the list of the the taskListsKeys

        This will return
          1. null : if accessed for the first time or after manual clear of the localStorage
          2. stringified Array
      */
      var tl_keyArr = this.getValue(tlconfig.taskListsKey);
      /*
        If the list is null :
          initializeDummyData and then re-fetch the key list
      */
      if(tl_keyArr == null){
        this.reset();
        tl_keyArr = this.getValue(tlconfig.taskListsKey);
      }

      /*
        It is guaranteed to have an tl_keyArr : either last saved or dummy.
        The value received is still an string so we need to parse that
      */
      tl_keyArr = JSON.parse(tl_keyArr);
      dataStore.tlKeyArr = tl_keyArr;
      /*
        For every key received , run a function to do the following
          1. get the data from localStorage
          2. parse the string received
          3. push the object in the dataStore
      */
      var self = this;
      tl_keyArr.forEach(function(key,index,arr){
        dataStore.tlArr.push(
          JSON.parse(self.getValue(key))
        )
      });

      return dataStore.tlArr;
    }

  }
}])
.factory("logicFactory",["dataStore","StoreManager","taskListConfig",function(dataStore,StoreManager,tlConfig){
  return {
    reset:function(){
      StoreManager.reset();
    },
    getInitialData:function(){
      return StoreManager.getTaskList()
    },
    addTaskList:function(title){
      var key = "tlkey_" + (new Date()).getTime();
      var tl = {
        key : key,
        title : title,
        colorCodeClass : tlConfig.defaultColorClass,
        taskList:[]
      };
      dataStore.tlKeyArr.push(key);
      dataStore.tlArr.push(tl);
      StoreManager.setValue(tlConfig.taskListsKey,JSON.stringify(dataStore.tlKeyArr));
      StoreManager.setValue(key,JSON.stringify(tl));
    },
    removeTaskList:function(index){
      var key = dataStore.tlKeyArr[index];
      dataStore.tlKeyArr.splice(index,1);
      dataStore.tlArr.splice(index,1);
      StoreManager.setValue(tlConfig.taskListsKey,JSON.stringify(dataStore.tlKeyArr));
      StoreManager.removeKey(key);
    },
    addTask:function(tlIndex,taskText){
      dataStore.tlArr[tlIndex].taskList.push({
        taskText:taskText,
        isDone:false
      });
      StoreManager.saveModifiedTaskList(tlIndex);
    },
    delTask:function(tlIndex,taskIndex){
      dataStore.tlArr[tlIndex].taskList.splice(taskIndex,1);
      StoreManager.saveModifiedTaskList(tlIndex);
    },
    toggleTaskStatus:function(tlIndex,index){
      dataStore.tlArr[tlIndex].taskList[index].isDone = !dataStore.tlArr[tlIndex].taskList[index].isDone;
      StoreManager.saveModifiedTaskList(tlIndex);
    }
  };
}])
.controller("mainController",["$scope","logicFactory",function($scope,logicFactory){
  $scope.tlTitle = "";
  $scope.taskText = "";
  $scope.activeKey = "none";
  $scope.isaddTLModalOpen = false;
  $scope.tlArr = logicFactory.getInitialData();

  $scope.reset = function(){
    logicFactory.reset();
    $scope.tlArr = logicFactory.getInitialData();
  };
  /**/
  $scope.initAddTask = function(key){
    if($scope.activeKey === key){
      $scope.activeKey = "none";
    }else{
      $scope.activeKey = key;
    }
  }
  $scope.togglenTLAddModal = function(){
    $scope.isaddTLModalOpen = !$scope.isaddTLModalOpen;
    $scope.tlTitle = "";
  }
  /*
    Function Related to Task List Objects
    1. Add a Task List
    2. Remove a Task List
    3. Rename a Task List title
    4. Change the color code of the task List
  */
  $scope.addTaskList = function(title){
    logicFactory.addTaskList(title);
    $scope.togglenTLAddModal();
  };
  $scope.removeTaskList = function(index){
    logicFactory.removeTaskList(index);
  };

  /*
    Function related to unit Tasks
    1. Add a Task
    2. Delete a Task
    3. Edit a Task Text
    4. Toggle task status
  */

  $scope.addTask = function(tlIndex,taskText){
    logicFactory.addTask(tlIndex,taskText);
    $scope.taskText = "";
    $scope.activeKey = "none";
  };
  $scope.delTask = function(tlIndex,taskIndex){
    logicFactory.delTask(tlIndex,taskIndex);
  };
  $scope.toggleTaskStatus = function(tlIndex,taskIndex){
    logicFactory.toggleTaskStatus(tlIndex,taskIndex);
  };
}])
.factory("dummyDataInitialization",["taskListConfig",function(tlConfig){
  return {
    initializeDummyData:function(){
      var taskListArr = ["taskList1_key","taskList2_key","taskList3_key"];
      var taskList1_key_obj = {
        key : "taskList1_key",
        title : "Self Learning",
        colorCodeClass : tlConfig.defaultColorClass,
        taskList : [{
          taskText:"Angular JS",
          isDone:true
        },{
          taskText:"ECMA Script 6",
          isDone:false
        },{
          taskText:"Gulp",
          isDone:false
        }]
      };
      var taskList2_key_obj = {
        key : "taskList2_key",
        title : "Action Items",
        colorCodeClass : tlConfig.defaultColorClass,
        taskList : [{
          taskText:"Resolving Defect #VFAY83",
          isDone:true
        },{
          taskText:"Preparing SOE",
          isDone:true
        },{
          taskText:"Sending Reports",
          isDone:false
        }]
      };
      var taskList3_key_obj = {
        key : "taskList3_key",
        title : "Home / Grocessary",
        colorCodeClass : tlConfig.defaultColorClass,
        taskList : [{
          taskText:"Get stationary items",
          isDone:true
        },{
          taskText:"Chocoates for kids",
          isDone:false
        },{
          taskText:"Vegitables & Fruits",
          isDone:false
        }]
      };

      //Set up the localStorage
      localStorage.clear();
      localStorage.setItem(tlConfig.taskListsKey,JSON.stringify(taskListArr));
      localStorage.setItem("taskList1_key",JSON.stringify(taskList1_key_obj));
      localStorage.setItem("taskList2_key",JSON.stringify(taskList2_key_obj));
      localStorage.setItem("taskList3_key",JSON.stringify(taskList3_key_obj));
    }
  }
}])
