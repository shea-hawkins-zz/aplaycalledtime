var stats = [{id: "1", name: "Bench", type: "lift", value: "8x45", conf: 8},
             {id: "2", name: "Incline Machine", type: "lift", value: "8x45", conf: 8},
             {id: "3", name: "Pullup", type: "lift", value: "8x5", conf: 7},
             {id: "4", name: "stat", type: "lift", value: "8x45", conf: 8},
             {id: "5", name: "stat", type: "lift", value: "8x45", conf: 8},
             {id: "6", name: "stat", type: "lift", value: "8x45", conf: 8}
           ];

var statBlocks = [{id:"1", type: "statBlock", stats: ["1", "2", "3"]},
                  {id:"2", type: "statBlock", stats: ["4", "5", "6"]}];

var days = [{id: "1", date: "19-12-2015", statBlocks: ["1"]}];

var months = [{id: "1", days: ["1"]}];

var getMaxId = function(arr){
  var maxId = arr.reduce((mem, e) => {
    return Math.max(mem, e.id);
  }, arr[0].id);
  return (maxId + 1).toString();
};

var getStat = function(id) {
  return stats.filter((e) => {return e.id === id;})[0];
}

var getStatBlock = function(id) {
  return statBlocks[indexOfId(statBlocks, id)];
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
  return {month: months[indexOfId(months, monthId)], newDayEdge: day};
}

var addStatBlockToParent = function(statBlock, parent) {
  var statBlockId = createStatBlock(statBlock).id;
  if (parent.type === 'Day') {
    days[indexOfId(days, parent.id)].statBlocks.push(statBlockId);
  }
  return parent;
}
