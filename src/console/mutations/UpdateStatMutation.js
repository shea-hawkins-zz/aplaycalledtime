import Relay from 'react-relay';

export default class UpdateStatMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{updateStat}`;
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateStatPayload {
        stat {
          id,
          type,
          value,
          conf
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {stat: this.props.stat.id}
    }];
  }
  getVariables() {
    return { stat: this.props.stat };
  }
}
