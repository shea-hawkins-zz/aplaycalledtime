import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLBoolean
} from 'graphql';
import {
  nodeDefinitions,
  fromGlobalId,
  toGlobalId,
  globalIdField,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
  mutationWithClientMutationId
} from 'graphql-relay';
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
                {parentTypes: ["Lower Raise", "Lower Split"], type: "Squat"},
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
                {parentTypes: ["Stats"], type: "Waist"},
                {parentTypes: ["Stats"], type: "Chest"},
                {parentTypes: ["Stats"], type: "LArm"},
                {parentTypes: ["Stats"], type: "RArm"},
                {parentTypes: ["Stats"], type: "LLeg"},
                {parentTypes: ["Stats"], type: "RLeg"}
              ];

var days = [{id: "1", date: "19-12-2015", statBlocks: ["1"]},
            {id: "2", date: "31-12-2015", statBlocks: []}];

var months = [{id: "1", days: ["1", "2"], maxDate: "31-12-2015"}];

var journey = [{id: "1", date: "13-1-2016", title: "On Routine", preview: "The path wears the more it is walked.", content: {
                                                                                    silver-markdown: "And along the path, you find a pen.",
                                                                                    silver-html: "<span>And along the path, you find a pen.<span>",
                                                                                    gold-markdown: "And along the path, you find a brush.",
                                                                                    gold-html: "<span>And along the path, you find a brush.</span>"
                                                                                    }}];

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
  return journey[indexOfId(journey, id)];
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

var getTypes = function(typeType, parentType) {
  if (typeType == "StatBlock") {
    return statBlockTypes
                      .filter(function(e) {
                        var parentOf = false;
                        e.parentTypes.forEach(function(e){
                          if (e === parentType) {
                            parentOf = true;
                          }
                        });
                        return parentOf;
                      });
  } else if (typeType == "Stat") {
    return statTypes
                .filter(function(e) {
                  var parentOf = false;
                  e.parentTypes.forEach(function(e){
                    if (e === parentType) {
                      parentOf = true;
                    }
                  });
                  return parentOf;
                });
  }
}

var getNode = (globalId) => {
  var {type, id} = fromGlobalId(globalId);
  if (type === 'Stat') {
    return getStat(id);
  } else if (type === 'StatBlock') {
    return getStatBlock(id);
  } else if (type === 'Day') {
    return getDay(id);
  } else if (type === 'Month') {
    return getMonth(id);
  }
};

var getType = (obj) => {
  if (!obj.stats && !obj.statBlocks && !obj.days) {
    return statType;
  } else if (obj.stats) {
    return statBlockType;
  } else if (obj.statBlocks && !obj.days) {
    return dayType;
  } else if (obj.days) {
    return monthType;
  } else if (obj.content) {
    return journalType;
  }
};

var {nodeInterface, nodeField} = nodeDefinitions(getNode, getType);
//JourneyTypes
var journalType = new GraphQLObjectType({
  name: 'Journal',
  fields: () => ({
    id: globalIdField('Journal'),
    date: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: new GraphQLObjectType({
        name: 'JournalContent',
        fields: {
          silver-markdown: { type: GraphQLString },
          silver-html: { type: GraphQLString },
          gold-markdown: { type: GraphQLString },
          gold-html: { type: GraphQLString }
        }
      })}
  }),
  interfaces: [nodeInterface]
});

//consoleTypes
var statType = new GraphQLObjectType({
  name: 'Stat',
  fields: () => ({
    id: globalIdField('Stat'),
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    value: { type: GraphQLString },
    conf: { type: GraphQLInt }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: statConnection} =
  connectionDefinitions({name: 'Stat', nodeType: statType});

var statBlockType = new GraphQLObjectType({
  name: 'StatBlock',
  fields: () => ({
    id: globalIdField('StatBlock'),
    type: { type: GraphQLString },
    goal: {
      type: statBlockType,
      resolve: (statBlock) => getGoal(statBlock.type)
    },
    statTypes: {
      type: new GraphQLList(typeType),
      resolve: (statBlock) => getTypes("Stat", statBlock.type)
    },    //add prevStat here with type StatBlock with a resolve that takes
    //statblockid and returns a statblock.
    stats: {
      type: statConnection,
      args: connectionArgs,
      resolve: (statBlock, args) => connectionFromArray(
        //Retrieve stat details off of id. This resolve receives "this"
        //statblock as an argument.
        statBlock.stats.map((id) => {
			  return getStat(id);
		}),
        args
      )
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: statBlockConnection} =
  connectionDefinitions({name: 'StatBlock', nodeType: statBlockType});

var statBlockParentInterface = new GraphQLInterfaceType({
  name: 'StatBlockParentInterface',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    statBlocks: {
      type: new GraphQLNonNull(statBlockConnection),
      args: connectionArgs,
    }
  }),
  resolveType(obj) {
    return dayType;
  }
});

var typeType = new GraphQLObjectType({
  name: 'Type',
  fields: () => ({
    parentTypes: { type: new GraphQLList(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) }
  })
});

var dayType = new GraphQLObjectType({
  name: 'Day',
  fields: () => ({
    id: globalIdField('Day'),
    date: { type: GraphQLString },
    weight: { type: GraphQLInt },
    statBlockTypes: {
                      type: new GraphQLList(typeType),
                      resolve: () => {
                          return getTypes('StatBlock', 'Day');
                        }
                    },
    statBlocks: {
      type: new GraphQLNonNull(statBlockConnection),
      args: connectionArgs,
      resolve: (day, args) => connectionFromArray(
        day.statBlocks.map((id) => {
			       return getStatBlock(id);
		    }),
        args
      )
    }
  }),
  interfaces: [nodeInterface, statBlockParentInterface]
});

var {connectionType: dayConnection} = connectionDefinitions({name: 'Day', nodeType: dayType});

var monthType = new GraphQLObjectType({
  name: 'Month',
  fields: () => ({
    id: globalIdField('Month'),
    maxDate: {
      type: GraphQLString,
    },
    days: {
      type: dayConnection,
      args: connectionArgs,
      resolve: (month, args) => connectionFromArray(
        month.days.map( (e) => getDay(e) ),
        args
      )
    }
  }),
  interfaces: [nodeInterface]
});

var addDayMutation = mutationWithClientMutationId({
  name: 'AddDay',
  inputFields: {
    date: { type: GraphQLString },
    monthId: { type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    month: {
      type: monthType,
      resolve: (payload) => payload.month
    },
    newDayEdge: {
      type: dayType,
      resolve: (payload) => payload.newDayEdge
    }
  },
  mutateAndGetPayload: ({date, monthId}) => {
    return createDay(date, fromGlobalId(monthId).id);
  }
});

var updateWeightMutation = mutationWithClientMutationId({
  name: 'UpdateWeight',
  inputFields: {
    dayId: { type: new GraphQLNonNull(GraphQLID) },
    weight: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    day: {
      type: dayType,
      resolve: (payload) => {
        return getDay(payload.dayId);
      }
    }
  },
  mutateAndGetPayload: ({dayId, weight}) => {
    dayId = fromGlobalId(dayId).id;
    updateWeight(dayId, weight);
    return {dayId: dayId};
  }
});

var addStatBlockToParentMutation = mutationWithClientMutationId({
  name: 'AddStatBlockToParent',
  inputFields: {
    statBlock: { type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'StatBlockInput',
        fields: {
          type: { type: new GraphQLNonNull(GraphQLString) }
        }
      }))
    },
    parentId: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    parent: {
      type: dayType, // Look up how list types work (resolveType?) new GraphQLList(statBlockParentInterface),
      resolve: (payload) => {
          var {type, id} = payload;
          var day =  getNode(toGlobalId(type, id));
          return day;
      }
    },
  },
  mutateAndGetPayload: ({statBlock, parentId}) => {
    var parent = fromGlobalId(parentId);
    return addStatBlockToParent(statBlock, parent);
  }
});


var addStatMutation = mutationWithClientMutationId({
  name: 'AddStat',
  inputFields: {
    statBlockId: { type: new GraphQLNonNull(GraphQLID) },
    stat: { type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'StatInput',
        fields: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          type: { type: new GraphQLNonNull(GraphQLString) },
          value: { type: new GraphQLNonNull(GraphQLString) },
          conf: { type: GraphQLInt }
        }
      }))
    }
  },
  outputFields: {
    stat: {
      type: statType,
      resolve: (payload) => getStat(payload.statId)
    },
    statBlock: {
      type: statBlockType,
      resolve: (payload) => getStatBlock(payload.statBlockId)
    }
  },
  mutateAndGetPayload: ({stat, statBlockId}) => {
    var localStatBlockId = fromGlobalId(statBlockId).id;
    var newStat = createStat(stat, localStatBlockId);
    return {
      statId: newStat.id,
      statBlockId: localStatBlockId,
    };
  }
});

var updateStatMutation = mutationWithClientMutationId({
  name: 'UpdateStat',
  inputFields: {
    stat: { type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'StatUpdateInput',
        fields: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          type: { type: GraphQLString },
          value: { type: GraphQLString },
          conf: { type: GraphQLInt }
        }
      }))
    }
  },
  outputFields: {
    stat: {
      type: statType,
      resolve: (payload) => payload.stat
    }
  },
  mutateAndGetPayload: ({stat}) => {
    stat.id = fromGlobalId(stat.id).id;
    var stat = updateStat(stat);
    return {
      stat: stat
    };
  }
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      stat: {
        type: statType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: function (_, args) {
          return getStat(fromGlobalId(args.id).id);
        }
      },
      statBlock: {
          type: statBlockType,
          args: {
            id: { type: GraphQLID }
          },
          resolve: function(_, args) {
            return getStatBlock(fromGlobalId(args.id).id);
          }
      },
      statBlocks: {
        type: statBlockConnection,
        args: connectionArgs,
        resolve: (_, args) => connectionFromArray(statBlocks, args)
      },
      day: {
        type: dayType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: (_, args) => {
          return getDay(fromGlobalId(args.id).id);
        }
      },
      month: {
        type: monthType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: (_, args) => {
          return getMonth("1");
        }
      },
      node: nodeField
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      addStat: addStatMutation,
      addDay: addDayMutation,
      addStatBlockToParent: addStatBlockToParentMutation,
      updateWeight: updateWeightMutation,
      updateStat: updateStatMutation
    })
  })
});
