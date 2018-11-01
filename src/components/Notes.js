import React from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom'; 
import { connect } from 'react-redux';
import { fetchNotes, notesUpdated, sortNotes } from '../actions';

class Notes extends React.Component {
    constructor() {
        super();
        this.state = {
            filteredNotes: null,
            noteBegin: 0,
            noteEnd: 8
        }
    }

    componentDidUpdate() {
        if (this.props.notesNeedsUpdate) {
            this.props.fetchNotes();
            this.props.notesUpdated(); 
        }
    }

    paginationClick() {
        function pagination() {
            let notesBegin = 0; //state
            let notesEnd = 8; //state
            const notesAllowed = 9;
            const numberOfNotes = 10; 
            const click = 'right';
                  //9 notes per page, initial state noteBegin and noteEnd reflect this
            const pages = Math.ceil(numberOfNotes/notesAllowed);
            console.log('pages', pages);
          
            let currentPage = 1; //state
          
            if(pages > 1) {
                if(click === 'right' && currentPage < pages) {
                  notesBegin += notesAllowed; //set to state
                  notesEnd += notesAllowed; 
                  currentPage += 1;  
                } else if (click === 'left' && currentPage > 1) {
                  notesBegin -= notesAllowed;
                  notesEnd -= notesAllowed;
                  currentPage -= 1; 
                } else { return null }
            } else {
                return null; 
            }
          
            console.log('notesBegin', notesBegin);
            console.log('notesEnd', notesEnd);
            console.log('currentPage', currentPage);
          }
          
          console.log(pagination());
    }

    searchHandler = event => {
        const notes = this.props.notes.filter(note => {

            const title = note.title.toLowerCase();
            const content = note.content.toLowerCase();
            const searchTerm = event.target.value.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                return note;
            } return null;
        });
        this.setState({ filteredNotes: notes});
    }

    isAuthenticated() {
        let loggedIn = JSON.parse(localStorage.getItem('gotrue.user'));

        if(loggedIn) {
            return true;
        } return false; 
    }

    render() {
        if(this.isAuthenticated()) {
            return (
                <div className='main-view'>
                    {this.props.fetchingNotes ? (
                        <h2>Looking for notes...</h2>
                    ) : (
                    <div>
                        <div className="search-bar-container">
                            <div className="sort">
                                SORT:  
                                <div className="sort-button" onClick={()=> this.props.sortNotes()}>A-Z</div>
                            </div>
                            <input type="text" className="search-bar" placeholder="Search Notes..." onChange={this.searchHandler}/>
                        </div>                    
                        <h2>Your Notes:</h2>
                        <div className='notes-container'>
                            {this.state.filteredNotes ? (
                                this.state.filteredNotes.map(note => {
                                    return (
                                        <NavLink to={`/note/${note.id}`} className='note-container' key={note.id}>
                                            <h3>{note.title}</h3>
                                            <p>{note.content}</p>
                                        </NavLink>
                                    )
                                })
                            ) : (
                                this.props.notes.map(note => {
                                    return (
                                        <NavLink to={`/note/${note.id}`} className='note-container' key={note.id}>
                                            <h3>{note.title}</h3>
                                            <p>{note.content}</p>
                                        </NavLink>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    )}
                </div>
            )
        } else {
            return (
                <div className='main-view'>
                    <h2>Log in or sign up to see notes</h2>
                </div>
            )
        }
    }

}

const mapStateToProps = state => {
    return {
        notes: state.notes,
        fetchingNotes: state.fetchingNotes,
        notesNeedsUpdate: state.notesNeedsUpdate,
        numberOfNotes: state.numberOfNotes
    }
}

export default withRouter(connect(mapStateToProps, {fetchNotes, notesUpdated, sortNotes})(Notes));