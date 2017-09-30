import React, {Component} from 'react'

class Note extends Component {

    constructor(props) {
        super(props);


        this.state = {
            editing: false,
            value: ''
        };
    }

    toggleEdit() {
        this.setState({editing: !this.state.editing, value: this.props.children.val});
    }

    updateState(event) {
        this.setState({value: event.target.value});
    }

    saveNote() {
        this.props.onSave(this.state.value);
        this.setState({editing: false});
    }

    renderNote() {
        let {val} = this.props.children;
        return <div className="Note">
            {val}
            <div className="controls">
                <button className="edit" onClick={this.toggleEdit.bind(this)}>Edit</button>
                {' '}
                <button className="delete" onClick={this.props.onDelete}>Delete</button>
            </div>
        </div>;
    }

    renderEdit() {
        return (
            <div className="Note">
                <textarea value={this.state.value} onChange={this.updateState.bind(this)} />
                {' '}
                <div className="controls">
                    <button className="save" onClick={this.saveNote.bind(this)}>Save</button>
                </div>
            </div>
        );
    }

    render() {
        return this.state.editing
            ? this.renderEdit()
            : this.renderNote();
    }

}

export default Note;