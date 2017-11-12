var newsSources = [
  { name: "Al Jazeera English", id: "al-jazeera-english", sort:"top"},{ name: "Ars Technica", id: "ars-technica", sort:"top"},{ name: "Associated Press", id: "associated-press", sort:"top"},
  { name: "BBC News", id: "bbc-news", sort:"top"},{ name: "BBC Sport", id: "bbc-sport", sort:"top"},{ name: "Bloomberg", id: "bloomberg", sort:"top"},{ name: "Business Insider", id: "business-insider", sort:"top"},
  { name: "Buzzfeed", id: "buzzfeed", sort:"top"},{ name: "CNBC", id: "cnbc", sort:"top"},{ name: "CNN", id: "cnn", sort:"top"},{ name: "Engadget", id: "engadget", sort:"top"},
  { name: "ESPN", id: "espn", sort:"top"},{ name: "ESPN CricInfo", id: "espn-cric-info", sort:"latest"},{ name: "Financial Times", id: "financial-times", sort:"top"},
  { name: "Fox Sports", id: "fox-sports", sort:"top"},{ name: "Google News", id: "google-news", sort:"top"},{ name: "Hacker News", id: "hacker-news", sort:"top"},
  { name: "Independent", id: "independent", sort:"top"},{ name: "Mashable", id: "mashable", sort:"top"},{ name: "MTV News", id: "mtv-news", sort:"top"},
  { name: "National Geographic", id: "national-geographic", sort:"top"},{ name: "New Scientist", id: "new-scientist", sort:"top"},{ name: "News Week", id: "newsweek", sort:"top"},
  { name: "NFL News", id: "nfl-news", sort:"top"},{ name: "Polygon", id: "polygon", sort:"top"},{ name: "Recode", id: "recode", sort:"top"},{ name: "Reuters", id: "reuters", sort:"top"},
  { name: "TechCrunch", id: "techcrunch", sort:"top"},{ name: "TechRadar", id: "techradar", sort:"top"},{ name: "The Economist", id: "the-economist", sort:"top"},{ name: "The Hindu", id: "the-hindu", sort:"top"},
  { name: "The Huffington Post", id: "the-huffington-post", sort:"top"},{ name: "The New York Times", id: "the-new-york-times", sort:"top"},{ name: "The Next Web", id: "the-next-web", sort:"top"},
  { name: "The Telegraph", id: "the-telegraph", sort:"top"},{ name: "The Times of India", id: "the-times-of-india", sort:"top"},{ name: "The Verge", id: "the-verge", sort:"top"},
  { name: "The Wall Street Journal", id: "the-wall-street-journal", sort:"top"},{ name: "The Washington Post", id: "the-washington-post", sort:"top"},{ name: "Time", id: "time", sort:"top"}
];
var METHOD_FACTORY = {
  createNewTaskElement: function(taskString,id) {
    var listItem=document.createElement("li");
    var checkBox=document.createElement("input");//checkbx
    var label=document.createElement("label");//label
    var hiddenInput = document.createElement("input");
    var editInput=document.createElement("input");//text
    var editButton=document.createElement("button");//edit button
    var deleteButton=document.createElement("button");//delete button

    label.innerText=taskString;
    checkBox.type="checkbox";
    hiddenInput.type="hidden";
    hiddenInput.value= id;
    editInput.type="text";
    editButton.innerText="Edit";
    editButton.className="edit";
    deleteButton.innerText="Delete";
    deleteButton.className="delete";

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(hiddenInput);
    return listItem;
  },
  addTask: function(){
    var taskInput=document.getElementById("new-task");
    var incompleteTaskHolder=document.getElementById("incomplete-tasks");
    if(taskInput.value != ""){
      var d = new Date();
      var listItem=METHOD_FACTORY.createNewTaskElement(taskInput.value,d.getTime());
      incompleteTaskHolder.appendChild(listItem);
      METHOD_FACTORY.bindTaskEvents(listItem, METHOD_FACTORY.taskCompleted);
      perfectNewTabContent.globalList.push({title:taskInput.value, status:'NOT_COMPLETED', id: d.getTime()})
      setItemsToChrome();
      taskInput.value="";
    }
  },
  editTask: function(){
    var listItem=this.parentNode;
    var editInput=listItem.querySelector('input[type=text]');
    var label=listItem.querySelector("label");
    var hiddenInput=listItem.querySelector('input[type=hidden]');
    var index = perfectNewTabContent.globalList.findIndex((obj => obj.id == hiddenInput.value));
    var containsClass=listItem.classList.contains("editMode");
      if(containsClass){
        label.innerText=editInput.value;
        var data = perfectNewTabContent.globalList[index];
        data.title = editInput.value;
        perfectNewTabContent.globalList[index] = data;
        setItemsToChrome();
      }else{
        editInput.value=label.innerText;
      }
      listItem.classList.toggle("editMode");
  },
  deleteTask: function(){
    var listItem=this.parentNode;
    var hiddenInput=listItem.querySelector('input[type=hidden]');
    var index = perfectNewTabContent.globalList.findIndex((obj => obj.id == hiddenInput.value));
    perfectNewTabContent.globalList.splice(index,1);
    setItemsToChrome();
    var ul=listItem.parentNode;
    ul.removeChild(listItem);
  },
  taskCompleted: function(){
    var listItem=this.parentNode;
    var hiddenInput=listItem.querySelector('input[type=hidden]');
    var completedTasksHolder=document.getElementById("completed-tasks");
    var index = perfectNewTabContent.globalList.findIndex((obj => obj.id == hiddenInput.value));
    var data = perfectNewTabContent.globalList[index];
    data.status = "COMPLETED";
    perfectNewTabContent.globalList[index] = data;
    setItemsToChrome();
    completedTasksHolder.appendChild(listItem);
    METHOD_FACTORY.bindTaskEvents(listItem, METHOD_FACTORY.taskIncomplete);
  },
  taskIncomplete: function(){
    var listItem=this.parentNode;
    var hiddenInput=listItem.querySelector('input[type=hidden]');
    var incompleteTaskHolder=document.getElementById("incomplete-tasks");
    var index = perfectNewTabContent.globalList.findIndex((obj => obj.id == hiddenInput.value));
    var data = perfectNewTabContent.globalList[index];
    data.status = "NOT_COMPLETED";
    perfectNewTabContent.globalList[index] = data;
    setItemsToChrome();
    incompleteTaskHolder.appendChild(listItem);
    METHOD_FACTORY.bindTaskEvents(listItem,METHOD_FACTORY.taskCompleted);
  },
  bindTaskEvents: function(taskListItem,checkBoxEventHandler){
    var checkBox=taskListItem.querySelector("input[type=checkbox]");
    var editButton=taskListItem.querySelector("button.edit");
    var deleteButton=taskListItem.querySelector("button.delete");

    editButton.onclick=METHOD_FACTORY.editTask;
    deleteButton.onclick=METHOD_FACTORY.deleteTask;
    checkBox.onchange=checkBoxEventHandler;
  },
  initPage: function(){
    var addButton=document.getElementById("addTask");
    var incompleteTaskHolder=document.getElementById("incomplete-tasks");
    var completedTasksHolder=document.getElementById("completed-tasks");
    addButton.addEventListener("click",METHOD_FACTORY.addTask);
    for (var i=0; i<incompleteTaskHolder.children.length;i++){
      METHOD_FACTORY.bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
    }

    for (var i=0; i<completedTasksHolder.children.length;i++){
      METHOD_FACTORY.bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
    }
    var profileModal=document.getElementById("profileModal");
    var profileLink=document.getElementById("profileSettings");
    profileLink.addEventListener("click",METHOD_FACTORY.showProfilePage);
    var close = document.getElementById("profileClose");
    close.onclick = function() {
      profileModal.style.display = "none";
    }
    var saveButton = document.getElementById("saveProfileData");
    saveButton.addEventListener("click",METHOD_FACTORY.saveProfileData);
    var sourceHolder = document.getElementById("sourceHolder");
    for (var i = 0, len = newsSources.length; i < len; i++) {
      sourceHolder.appendChild(METHOD_FACTORY.addSourceToProfilePage(newsSources[i]));
    }
  },
  saveProfileData: function(){
    var datepicker = document.getElementById("datepicker");
    if(datepicker.value){
      perfectNewTabContent.profileData.dateOfBirth = datepicker.value;
    }
    perfectNewTabContent.profileData.newsSources = [];
    for (var i = 0, len = newsSources.length; i < len; i++) {
      var source = document.getElementById(newsSources[i].id);
      if(source.checked){
        perfectNewTabContent.profileData.newsSources.push(newsSources[i]);
      }
    }
    setItemsToChrome();
    document.getElementById("profileClose").click();
  },
  showProfilePage: function(){
    var profileModal=document.getElementById("profileModal");
    profileModal.style.display = "block";
    var datepicker = document.getElementById("datepicker");
    datepicker.max = new Date().toJSON().split('T')[0];
    if(perfectNewTabContent.profileData.dateOfBirth)
      datepicker.value = perfectNewTabContent.profileData.dateOfBirth;
    for (var i = 0, len = perfectNewTabContent.profileData.newsSources.length; i < len; i++) {
      var source = document.getElementById(perfectNewTabContent.profileData.newsSources[i].id);
      source.checked = true;
    }
  },
  addSourceToProfilePage: function(source) {
    var listItem=document.createElement("li");
    var checkBox=document.createElement("input");//checkbx
    var label=document.createElement("label");//label
    label.innerText=source.name;
    label.htmlFor=source.id;
    label.onclick = checkBox.click();
    checkBox.type="checkbox";
    checkBox.name="newsSource";
    checkBox.value=source.id;
    checkBox.id=source.id;
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    return listItem;
  },
  defaultInitialContent: function(){
    return {"PerfectNewTab":{"TO_DO_LIST":[],"PROFILE_DATA":{}}};
  },
  buildItemForPost: function(){
    return {"PerfectNewTab":{"TO_DO_LIST":perfectNewTabContent.globalList,"PROFILE_DATA":perfectNewTabContent.profileData}};
  },
  setAgeInterval: function(){
    setInterval(function() { METHOD_FACTORY.ageCalculator()}, 100);
  },
  clearAgeInterval: function(){
    clearInterval(setInterval(function() { METHOD_FACTORY.ageCalculator()}, 100));
  },
  ageCalculator: function(){
    var d = new Date(perfectNewTabContent.profileData.dateOfBirth);
    var t = Date.now() - d.getTime();
    var ageContent = document.getElementById("ageContent");
    ageContent.innerHTML = "<span>Age:</span>&nbsp;" + (t/31556900000).toFixed(10);
  },
  apiKey: function(){
    return "dbf7de22e95b456fbe9adcbef7d222ee";
  },
  getDataForFeedSource: function(source){
    (function(source){
      var feedHolder = document.getElementById("feedContent");
      var dataFromSource = new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            resolve({articles:this.responseText,source:source});
          }
        };
        xhttp.open("GET", "https://newsapi.org/v1/articles?source="+source.id+"&sortBy="+source.sort+"&apiKey="+METHOD_FACTORY.apiKey(), true);
        xhttp.send();
      });
      dataFromSource.then(function(data){
        var feedHolder = document.getElementById("feedContent");
        var feedTitleButton=document.createElement("button");
        feedTitleButton.id=data.source.id;
        feedTitleButton.innerText = data.source.name;
        feedTitleButton.className = "accordion";
        feedTitleButton.addEventListener("click",METHOD_FACTORY.toggleContentPanels);
        var feedContentPanel=document.createElement("div");
        feedContentPanel.id=data.source.id+"content";
        feedContentPanel.className = "accordionpanel";
        feedContentPanel.innerHTML = METHOD_FACTORY.buildFeedHTML(data.articles);
        feedHolder.appendChild(feedTitleButton);
        feedHolder.appendChild(feedContentPanel);
      });
    }(source));
  },
  toggleContentPanels: function(){

    var panels = document.getElementsByClassName("accordionpanel");
    for(var i=0, len = panels.length; i < len ; i++){
      if(panels[i].id == this.id+"content"){
        if(panels[i].style.maxHeight == "" || panels[i].style.maxHeight == null){
          panels[i].style.maxHeight = panels[i].scrollHeight + "px";
        } else {
          panels[i].style.maxHeight = null;
        }
      } else {
        panels[i].style.maxHeight = null;
      }
    }
  },
  buildFeedHTML: function(articles) {
    var html ="";
    if(articles) {
      var content = JSON.parse(articles).articles;
      html += "<ul>"
      for(var i=0, len= content.length; i< len; i++) {
        html += "<li style='display:flex'><div><img src='"+ content[i].urlToImage +"' /></div><div style='padding-left:5px'><a target='_new' href='"+ content[i].url +"'>"+content[i].title+"</a><br><span>"+ content[i].description +"</span></div></li>";
      }
      html +="</ul>"
    } else {
      html="No New Content Found";
    }
    return html;
  },
  getFeedData: function() {
    var sources = perfectNewTabContent.profileData.newsSources;
    for (var i = 0, len = sources.length; i < len; i++) {
      METHOD_FACTORY.getDataForFeedSource(sources[i]);
    }
  }
}
var perfectNewTabContent = {
  globalList: [],
  profileData: {},
  feedData: []
};
var getItemsFromChrome = new Promise(function (resolve, reject) {
    var data = METHOD_FACTORY.defaultInitialContent;
    chrome.storage.sync.get("PerfectNewTab", function (items) {
        if(items.PerfectNewTab == undefined){
          chrome.storage.sync.set(METHOD_FACTORY.defaultInitialContent);
        } else {
          data = items.PerfectNewTab;
        }
        resolve(data);
    });
});
getItemsFromChrome.then(function (data) {
  var toDoList = data.TO_DO_LIST;
  var profileData = data.PROFILE_DATA;
  perfectNewTabContent.profileData = profileData;
  perfectNewTabContent.globalList = toDoList;
  for(var i=0; i < toDoList.length; i++){
    if(toDoList[i].status == "COMPLETED"){
      var listItem=METHOD_FACTORY.createNewTaskElement(toDoList[i].title,toDoList[i].id);
      var completedTasksHolder=document.getElementById("completed-tasks");
      completedTasksHolder.appendChild(listItem);
      METHOD_FACTORY.bindTaskEvents(listItem, METHOD_FACTORY.taskIncomplete);
    } else if(toDoList[i].status == "NOT_COMPLETED"){
      var listItem=METHOD_FACTORY.createNewTaskElement(toDoList[i].title,toDoList[i].id);
      var incompleteTaskHolder=document.getElementById("incomplete-tasks");
      incompleteTaskHolder.appendChild(listItem);
      METHOD_FACTORY.bindTaskEvents(listItem, METHOD_FACTORY.taskCompleted);
    }
  }
  if(perfectNewTabContent.profileData.dateOfBirth){
    METHOD_FACTORY.ageCalculator();
    METHOD_FACTORY.setAgeInterval();
  }
  if(!perfectNewTabContent.profileData.newsSources)
    perfectNewTabContent.profileData.newsSources = [];

  METHOD_FACTORY.getFeedData();
});

var setItemsToChrome = function(){
  chrome.storage.sync.set(METHOD_FACTORY.buildItemForPost());
};

METHOD_FACTORY.initPage();
