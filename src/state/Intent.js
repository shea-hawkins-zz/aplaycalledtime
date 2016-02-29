import Rx from 'rxjs';

var subjects = {
  toggleNewSubject: new Rx.Subject(),
  toggleGoalUpdateSubject: new Rx.Subject(),
  toggleGoalShowSubject: new Rx.Subject(),
  toggleGoldShowSubject: new Rx.Subject()
};

export default {
  subjects: subjects,
  toggleNew: () => subjects.toggleNewSubject.next(),
  toggleGoalUpdate: () => subjects.toggleGoalUpdateSubject.next(),
  toggleGoalShow: () => subjects.toggleGoalShowSubject.next(),
  toggleGoldShow: () => subjects.toggleGoldShowSubject.next()
}
