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
