import Relay from 'react-relay';

export default class AddDayMutation extends Relay.Mutation {
  static fragments = {
    month: () => Relay.QL`
      fragment on Month {
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
        month {
          maxDate,
          days
        }
      }
    `
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {month: this.props.month.id}
    }];
  }
  getVariables() {
    var today = new Date();
    var dateString = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return { date: dateString, monthId: this.props.month.id };
  }
}
