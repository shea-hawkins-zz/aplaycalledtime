import Relay from 'react-relay';

export default class AddStatBlockToDayMutation extends Relay.Mutation {
  static fragments = {
    day: () => Relay.QL`
      fragment on Day {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{addStatBlockToParent}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddStatBlockToParentPayload {
        parent {
              id,
              statBlocks
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        parent: this.props.day.id
      }
    }];
  }
  getVariables() {
    return {
      parentId: this.props.day.id,
      statBlock: this.props.newStatBlock
    };
  }

}
