import Firebase from 'firebase'
import EventEmitter from 'events'

// extend EventEmitter so user of NoteRepository can react to our own defined events (ex: noteRepository.on('added'))
class NoteRepository extends EventEmitter {
  constructor () {
    super()
    // firebase reference to the notes
    var config = {
      apiKey: "AIzaSyAYVtNf1LZjvCRHVGsktSXJi1zTm0a4xHs",
      authDomain: "fir-link-aa249.firebaseapp.com",
      databaseURL: "https://fir-link-aa249.firebaseio.com",
      storageBucket: "fir-link-aa249.appspot.com",
    };

    this.ref = Firebase.initializeApp(config);// will have same result as new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/').child('notes')
    this.attachFirebaseListeners()
  }
  // creates a note
  create ({title = '', content = ''}, onComplete) {
    this.ref.database().ref('notes').push({title, content}, onComplete)
  }
  // updates a note
  update ({key, title = '', content = ''}, onComplete) {
    this.ref.database().ref('notes').child(key).update({title, content}, onComplete) // key is used to find the child, a new note object is made without the key, to prevent key being inserted in Firebase
    // this.ref.child(key) will create new reference like this new Firebase(`https://<YOUR-FIREBASE-APP>.firebaseio.com/notes/${key}`)
  }
  // removes a note
  remove ({key}, onComplete) {
    this.ref.database().ref('notes').child(key).remove(onComplete)
  }

  // attach listeners to Firebase
  attachFirebaseListeners () {
    this.ref.database().ref('notes').on('child_added', this.onAdded, this)
    this.ref.database().ref('notes').on('child_removed', this.onRemoved, this)
    this.ref.database().ref('notes').on('child_changed', this.onChanged, this)
  }
  onAdded (snapshot) {
    // process data
    let note = this.snapshotToNote(snapshot)
    // propagate event outwards with note
    this.emit('added', note)
  }
  onRemoved (oldSnapshot) {
    let note = this.snapshotToNote(oldSnapshot)
    this.emit('removed', note)
  }
  onChanged (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('changed', note)
  }
  // processes the snapshots to consistent note with key
  snapshotToNote (snapshot) {
    // we will need the key often, so we always want to have the key included in the note
    let key = snapshot.key()
    let note = snapshot.val()
    note.key = key
    return note
  }
  // Finds the index of the note inside the array by looking for its key
 findIndex (notes, key) {
   return notes.findIndex(note => note.key === key)
 }
 // Finds the note inside the array by looking for its key
 find (notes, key) {
   return notes.find(note => note.key === key)
 }
}
export default new NoteRepository() // this instance will be shared across imports
