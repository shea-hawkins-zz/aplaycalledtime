//On addition of graphql SubmitJournal, convert from markdown immediately and store markdown + html in
//database or memory.
var getMaxId = function(arr){
  var maxId = arr.reduce((mem, e) => {
    return Math.max(mem, e.id);
  }, arr[0].id);
  return (maxId + 1).toString();
};

var stats = [
             {id: "1", name: "Bench", type: "lift", value: "8x45", conf: 8},
             {id: "2", name: "Incline Machine", type: "lift", value: "8x45", conf: 8},
             {id: "3", name: "Pullup", type: "lift", value: "8x5", conf: 7},
             {id: "4", name: "Bench", type: "goal", value: "8x50"},
             {id: "5", name: "Incline Machine", type: "goal", value: "8x50"},
             {id: "6", name: "Pullup", type: "goal", value: "8x5"}
           ];

var statBlocks = [
                  {id:"1", type: "Upper Shoulders", stats: ["1", "2", "3"]}
                 ];

var statBlockTypes = [
                      {parentTypes: ["Day"], type: "Lower Raise"},
                      {parentTypes: ["Day"], type: "Lower Split"},
                      {parentTypes: ["Day"], type: "Upper Arms"},
                      {parentTypes: ["Day"], type: "Upper Shoulders"},
                      {parentTypes: ["Day"], type: "Sprints"},
                      {parentTypes: ["Day"], type: "Stats"},
                      {parentTypes: ["Day"], type: "Measurements"}
];

var goals = [
  {id: "7", type: "Upper Shoulders", stats: ["4", "5", "6"]}
];

var statTypes = [
                {typeType: , parentTypes: ["Lower Raise", "Lower Split"], type: "Squat"},
                {parentTypes: ["Lower Raise", "Lower Split"], type: "Deadlift"},
                {parentTypes: ["Upper Arms", "Upper Shoulders"], type: "Bench"},
                {parentTypes: ["Upper Arms", "Upper Shoulders"], type: "Pullup"},
                {parentTypes: ["Lower Split"], type: "Sitting Calf Raise"},
                {parentTypes: ["Lower Split"], type: "Split Lunges"},
                {parentTypes: ["Lower Split"], type: "Sitting Squat"},
                {parentTypes: ["Lower Raise"], type: "Standing Calf Raise"},
                {parentTypes: ["Lower Raise"], type: "Curl"},
                {parentTypes: ["Lower Raise"], type: "V-Squat"},
                {parentTypes: ["Upper Shoulders"], type: "Arnold Press"},
                {parentTypes: ["Upper Shoulders"], type: "Incline Row"},
                {parentTypes: ["Upper Shoulders"], type: "Incline Bench"},
                {parentTypes: ["Upper Arms"], type: "Tri Machine"},
                {parentTypes: ["Upper Arms"], type: "Curl"},
                {parentTypes: ["Upper Arms"], type: "Burnout"},
                {parentTypes: ["Sprints"], type: "Sprint"},
                {parentTypes: ["Sprints"], type: "Swim"},
                {parentTypes: ["Sprints"], type: "Box"},
                {parentTypes: ["Measurements"], type: "Waist"},
                {parentTypes: ["Measurements"], type: "Chest"},
                {parentTypes: ["Measurements"], type: "LArm"},
                {parentTypes: ["Measurements"], type: "RArm"},
                {parentTypes: ["Measurements"], type: "LLeg"},
                {parentTypes: ["Measurements"], type: "RLeg"}
              ];

var days = [{id: "1", date: "19-12-2015", statBlocks: ["1"]},
            {id: "2", date: "31-12-2015", statBlocks: []}];

var months = [{id: "1", days: ["1", "2"], maxDate: "31-12-2015"}];

var content = [ {id: "1", type: "silver-markdown", content: "On the path, you find a pen."},
                {id: "2", type: "silver-html", content: "On the path, you find a pen."},
                {id: "3", type: "gold-markdown", content: "On the path, you find a brush."},
                {id: "4", type: "gold-html", content: "On the path, you find a brush."}
              ];

var journals = [{id: "1", date: "13-1-2016", title: "On Routine", preview: "The path wears the more it is walked.",
                                                                              markdown: ["1", "3"],
                                                                              html: ["2", "4"]
                                                                                  }];

var journey = {id: "1", journals: ["1"]};

var updateWeight = function(dayId, weight) {
  var day = days[indexOfId(days, dayId)];
  day.weight = weight;
  days[indexOfId(days, dayId)] = day;
}

var updateStat = function(stat) {
	console.log(stat.id);
  var orStat = stats[indexOfId(stats, stat.id)];
  for (var key in stat) {
    orStat[key] = stat[key];
  }
  stats[indexOfId(stats, stat.id)] = orStat;
  return stats[indexOfId(stats, stat.id)];
}

var getJournal = function(id) {
  return journals[indexOfId(journals, id)];
}

var getJourney = function() {
  return journey;
}

var getContent = function(id) {
  return content[indexOfId(content, id)];
}

var getStat = function(id) {
  return stats.filter((e) => {return e.id === id;})[0];
}

var getStatBlock = function(id) {
  return statBlocks[indexOfId(statBlocks, id)];
}

var getGoal = function(type) {
  var goal = goals.filter(function(e) {
    return e.type === type;
  });
  console.log("goal");
  return goal[0];
}

var getDay = function(id){
  return days[indexOfId(days, id)];
}

var getMonth = function(id) {
  return months[indexOfId(months, id)];
}

var indexOfId = function(arr, id) {
  var ind = -1;
  arr.forEach(function(e, i){
    if (e.id === id) {
      ind = i;
    }
  });
  return ind;
}

var createStat = function(stat, statBlockId) {
  stat.id = getMaxId(stats);
  stats.push(stat);
  var ind = indexOfId(statBlocks, statBlockId);
  statBlocks[ind].stats.push(stat.id);
  return stat;
}

var createStatBlock = function(statBlock) {
  statBlock.id = getMaxId(statBlocks);
  statBlock.stats = [];
  statBlocks.push(statBlock);
  return statBlock;
}

var createDay = function(date, monthId) {
  var dayId = getMaxId(days);
  var day = {id: dayId, date: date, statBlocks: []};
  days.push(day);
  months[indexOfId(months, monthId)].days.push(day.id);
  months[indexOfId(months, monthId)].maxDate = day.date;
  return {month: months[indexOfId(months, monthId)], newDayEdge: day};
}

var addStatBlockToParent = function(statBlock, parent) {
  var statBlockId = createStatBlock(statBlock).id;
  if (parent.type === 'Day') {
    days[indexOfId(days, parent.id)].statBlocks.push(statBlockId);
  }
  return parent;
}
