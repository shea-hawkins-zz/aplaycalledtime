import Relay from 'react-relay';

export default class AddStatMutation extends Relay.Mutation {
  static fragments = {
    statBlock: () => Relay.QL`
      fragment on StatBlock {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{addStat}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddStatPayload {
        statBlock {
          stats(first: 5) {
            edges {
              node {
                name,
                value,
                conf
              }
            }
          }
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        statBlock: this.props.statBlock.id
      }
    }];
  }
  getVariables() {
    return {statBlockId: this.props.statBlock.id, stat: this.props.stat};
  }

}
