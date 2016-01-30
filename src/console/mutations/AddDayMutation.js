import Relay from 'react-relay';

export default class AddDayMutation extends Relay.Mutation {
  static fragments = {
    log: () => Relay.QL`
      fragment on Log {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{addDay}`;
  }
  getFatQuery() {
    return Relay.QL`
    fragment on AddDayPayload {
        log {
          isUpdateable,
          days
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {log: this.props.log.id}
    }];
  }
  getVariables() {
    return { logId: this.props.log.id };
  }
}
