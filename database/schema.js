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
  connectionFromPromisedArray,
  connectionDefinitions,
  mutationWithClientMutationId
} from 'graphql-relay';
import Time from './database/Time';

var getNode = (globalId) => {
  var {type, id} = fromGlobalId(globalId);
  if (type === 'Stat') {
    return Time.getStat(id);
  } else if (type === 'StatBlock') {
    return Time.getStatBlock(id);
  } else if (type === 'Day') {
    return Time.getDay(id);
  } else if (type === 'Log') {
    return Time.getLog(id);
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
    return logType;
  } else if (obj.content) {
    return journalType;
  } else if (obj.journals) {
    return journeyType;
  }
};

var {nodeInterface, nodeField} = nodeDefinitions(getNode, getType);

var contentType = new GraphQLObjectType({
  name: 'Content',
  fields: () => ({
    id: globalIdField('Content'),
    type: { type: GraphQLString },
    content: { type: GraphQLString }
  })
});

//JourneyTypes
var journalType = new GraphQLObjectType({
  name: 'Journal',
  fields: () => ({
    id: globalIdField('Journal'),
    date: { type: GraphQLString },
    title: { type: GraphQLString },
    preview: { type: GraphQLString },
    markdown: {
                type: contentType,
                resolve: (journal) => Time.getContent(journal.markdown)
              },
    html: {
            type: contentType,
            resolve: (journal) => Time.getContent(journal.html)
          },
    goldhtml: {
            type: contentType,
            resolve: (journal) => journal.goldhtml ? Time.getContent(journal.goldhtml) : null
          }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: journalConnection} =
  connectionDefinitions({name: 'Journal', nodeType: journalType});

var journeyType = new GraphQLObjectType({
  name: 'Journey',
  fields: () => ({
    id: globalIdField('Journey'),
    journals: {
      type: journalConnection,
      args: connectionArgs,
      resolve: (journey, args) => {
        //Make more performant by create getPlural Time functions.
        var promises = journey.journals.map(function(id) {
          return Time.getJournal(id);
        });
        var promiseArray = Promise.all(promises);
        return connectionFromPromisedArray(promiseArray, args);
      }
    }
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
      resolve: (statBlock) => Time.getGoal(statBlock.type)
    },
    statTypes: {
      type: new GraphQLList(typeType),
      resolve: (statBlock) => Time.getTypes("Stat", statBlock.type)
    },
    uniqueChildren: {
      type: GraphQLBoolean
    },
    stats: {
      type: statConnection,
      args: connectionArgs,
      resolve: (statBlock, args) => {
        //Make more performant by create getPlural Time functions.
        var promises = statBlock.stats.map(function(id) {
          return Time.getStat(id);
        });
        var promiseArray = Promise.all(promises);
        return connectionFromPromisedArray(promiseArray, args);
      }
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
    objectType: { type: new GraphQLNonNull(GraphQLString) },
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
                          return Time.getTypes("StatBlock","Day");
                        }
                    },
    statBlocks: {
      type: new GraphQLNonNull(statBlockConnection),
      args: connectionArgs,
      resolve: (day, args) =>
      {
        var promises = day.statBlocks.map(function(id) {
          return Time.getStatBlock(id);
        });
        var promiseArray = Promise.all(promises);
        return connectionFromPromisedArray(promiseArray, args);
      }
    }
  }),
  interfaces: [nodeInterface, statBlockParentInterface]
});

var {connectionType: dayConnection} = connectionDefinitions({name: 'Day', nodeType: dayType});

var logType = new GraphQLObjectType({
  name: 'Log',
  fields: () => ({
    id: globalIdField('Log'),
    lastUpdate: {
      type: GraphQLString,
    },
    isUpdateable: {
      type: GraphQLBoolean,
      resolve: (log) => {
        var splitDate = log.lastUpdate.split('-');
        var lastDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
        var today = new Date();
        var todayFloored = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return lastDate.getTime() < todayFloored.getTime() ? true : false;
      }
    },
    days: {
      type: dayConnection,
      args: connectionArgs,
      resolve: (log, args) => {
        //Make more performant by create getPlural Time functions.
        var promises = log.days.map(function(id) {
          return Time.getDay(id);
        });
        var promiseArray = Promise.all(promises);
        return connectionFromPromisedArray(promiseArray, args);
      }
    }
  }),
  interfaces: [nodeInterface]
});

var addDayMutation = mutationWithClientMutationId({
  name: 'AddDay',
  inputFields: {
    logId: { type: new GraphQLNonNull(GraphQLID)}
  },
  outputFields: {
    log: {
      type: logType,
      resolve: (payload) => Time.getLog(payload.logId)
    },
    newDayEdge: {
      type: dayType,
      resolve: (payload) => Time.getDay(payload.dayId)
    }
  },
  mutateAndGetPayload: ({logId}) => {
    var today = new Date();
    var dateString = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var logId = fromGlobalId(logId).id;
    return Time.getLog(logId).then(function(result) {
      var splitDate = result.lastUpdate.split('-');
      var lastDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
      var today = new Date();
      var todayFloored = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (lastDate.getTime() >= todayFloored.getTime()) {
        throw 'not updatable!';
      }
    }).then(function() {
      return Time.createStatBlock({type: "Note", stats: []});
    }).then(function (result) {
      return Time.createDay({date: dateString, statBlocks: [result.statBlockId]});
    }).then(function (result) {
      return Time.addDayToLog(result.dayId, dateString, logId);
    }).catch(function (err) {
      console.log(err);
    });
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
        return Time.getDay(payload.dayId);
      }
    }
  },
  mutateAndGetPayload: ({dayId, weight}) => {
    console.log(dayId);
    dayId = fromGlobalId(dayId).id;
    return Time.updateWeight(dayId, weight);
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
    var parentId = fromGlobalId(parentId).id;
    statBlock.stats = [];
    return Time.createStatBlock(statBlock).then(function (result) {
      return Time.addStatBlockToDay(result.statBlockId, parentId);
    }).then(function (result) {
      return {type: "Day", id: result.parentId};
    });
  }
});


var addStatMutation = mutationWithClientMutationId({
  name: 'AddStat',
  inputFields: {
    statBlockId: { type: new GraphQLNonNull(GraphQLID) },
    stat: { type: new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'StatInput',
        fields: {
          name: { type: GraphQLString },
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
      resolve: (payload) => Time.getStat(payload.statId)
    },
    statBlock: {
      type: statBlockType,
      resolve: (payload) => Time.getStatBlock(payload.statBlockId)
    }
  },
  mutateAndGetPayload: ({stat, statBlockId}) => {
    var localStatBlockId = fromGlobalId(statBlockId).id;
    return Time.createStat(stat).then(function(result) {
      return Time.addStatToBlock(result.statId, localStatBlockId);
    }).then(function(result) {
      return {
        statId: result.statId,
        statBlockId: result.statBlockId
      };
    });
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
    return Time.updateStat(stat);
  }
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      journal: {
        type: journalType,
        args: {
          id: {
            type: GraphQLID
          }
        },
        resolve: function (_, args) {
          return Time.getJournal(fromGlobalId(args.id).id);
        }
      },
      journey: {
        type: journeyType,
        resolve: function(_, args) {
          return Time.getJourney();
        }
      },
      stat: {
        type: statType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: function (_, args) {
          return Time.getStat(fromGlobalId(args.id).id);
        }
      },
      statBlock: {
          type: statBlockType,
          args: {
            id: { type: GraphQLID }
          },
          resolve: function(_, args) {
            return Time.getStatBlock(fromGlobalId(args.id).id);
          }
      },
      day: {
        type: dayType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: (_, args) => {
          return Time.getDay(fromGlobalId(args.id).id);
        }
      },
      log: {
        type: logType,
        resolve: (_, args) => {
          return Time.getLog("67e13cfe-7726-468e-b74b-7d3eacb982c8");
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
