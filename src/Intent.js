import Rx from 'rxjs';

var subjects = {
  toggleNewSubject: new Rx.Subject()
};

export default {
  subjects: subjects,
  toggleNew: () => subjects.toggleNewSubject.next()
}
