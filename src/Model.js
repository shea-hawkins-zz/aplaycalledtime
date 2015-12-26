import Rx from 'rxjs';
import update from 'react-addons-update';
import Intent from './Intent';

var subject = new Rx.ReplaySubject(1);

var state = {
  showNew: false
};

Intent.subjects.toggleNewSubject.subscribe(() => {
  state = update(state, {
    $merge: {
      showNew: state.showNew ? false : true
    }
  });
  subject.next(state);
});

subject.next(state);

export default {
  subject: subject
};
