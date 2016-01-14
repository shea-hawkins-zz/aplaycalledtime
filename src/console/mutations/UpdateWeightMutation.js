import Relay from 'react-relay';

export default class UpdateWeightMutation extends Relay.Mutation {
  static fragments = {
    day: () => Relay.QL`
      fragment on Day {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{updateWeight}`;
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateWeightPayload {
        day {
          weight
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {day: this.props.day.id}
    }];
  }
  getVariables() {
    return { dayId: this.props.day.id, weight: this.props.weight };
  }
}
