import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    statBlock: () => Relay.QL`query { statBlock(id: $id) }`,
  };
  static routeName = 'WorkoutAppHomeRoute';
}
