import React, {Component} from 'react'
import Note from './Note'

class PostBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: []
        };

        this.idCounter = 0;
    }

    getId() {
        return this.idCounter++;
    }

    updateNotes(id, newValue) {
        let newNotes = this.state.notes.slice(0);
        newNotes[id] = {id, val: newValue};
        this.setState({notes: newNotes});
    }

    addNote() {
        let newNotes = this.state.notes.slice(0);
        newNotes.push({id:this.getId(), val: 'New Note'});
        this.setState({notes: newNotes});
    }

    deleteNote(id) {
        let newNotes = this.state.notes.slice(0);
        let noteToDelete = newNotes.filter(note => note.id === id)[0];
        newNotes.splice(newNotes.indexOf(noteToDelete), 1);
        this.setState({notes: newNotes});
    }

    render() {
        let {notes} = this.state;
        return (
            <div className="PostBoard">
                <button className="add" onClick={this.addNote.bind(this)}>Add</button>
                <div className="notes">
                    {notes.map(note => <Note key={note.id}
                                             onSave={this.updateNotes.bind(this, note.id)}
                                             onDelete={this.deleteNote.bind(this, note.id)}>{note}</Note>)}
                </div>
            </div>
        );
    }

}

export default PostBoard;