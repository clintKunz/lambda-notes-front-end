import React from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchNotes } from '../actions';

class EditNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            title: '',
            content: ''
        }
    }


    componentDidMount() {
        this.props.fetchNotes();
        setTimeout(() => {
        const note = this.props.notes.find(note => note.id == this.props.match.params.id);
        this.setState({
            id: note.id,
            title: note.title,
            content: note.content
        })
        }, 1000);
    }

    handleInput = (event, props) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    render() {
        return (
            <div className='main-view'>
                <h2>Edit Note:</h2>
                <input type="text" className='title' name="title" value={this.state.title} onChange={this.handleInput} />
                <textarea className="text-body" name="content" value={this.state.content} onChange={this.handleInput} />
                <button><NavLink to={`/`} onClick={() => this.props.editNote(this.state)} className="button">Update</NavLink></button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        notes: state.notes
    }
}

export default connect(mapStateToProps, {fetchNotes})(EditNote); 