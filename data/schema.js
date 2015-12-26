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
  GraphQLInterfaceType
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
import data from './data.json';

var getMaxId = function(arr){
  var maxId = arr.reduce((mem, e) => {
    return Math.max(mem, e.id);
  }, arr[0].id);
  return (maxId + 1).toString();
};

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
  if (!obj.stats) {
    return statType;
  } else if (obj.stats) {
    return statBlockType;
  } else if (obj.statBlocks) {
    return dayType;
  } else if (obj.days) {
    return monthType;
  }
};

var {nodeInterface, nodeField} = nodeDefinitions(getNode, getType);

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
    prev: {
      type: statBlockType,
      resolve: (statBlock) => getStatBlock(statBlock.prev)
    },
    //add prevStat here with type StatBlock with a resolve that takes
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
                  args: connectionArgs
                }
  }),
  resolveType: getType
});

var dayType = new GraphQLObjectType({
  name: 'Day',
  fields: () => ({
    id: globalIdField('Day'),
    date: { type: GraphQLString },
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
      type: new GraphQLList(statBlockParentInterface),
      resolve: (payload) => {
          console.log(3);
          var {type, id} = payload;
          console.log(type);
          var day =  getNode(toGlobalId(type, id));
          console.log(day.statBlocks);
          return day;
      }
    },
  },
  mutateAndGetPayload: ({statBlock, parentId}) => {
    console.log(1);
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
          conf: { type: new GraphQLNonNull(GraphQLInt) }
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
      addStatBlockToParent: addStatBlockToParentMutation
    })
  })
});
