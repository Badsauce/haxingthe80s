import React, { Component } from 'react';
import './App.css';
import { getIdeas, getComments, getPeople } from './api.js'

const Comment = ({ comment }) => {
  return (
    <li className="comment">
      <h1 className="commentAuthor">{comment.author || 'no one'}</h1>
      <p className="commentContent">{comment.content}</p>
    </li>
  )
}

const Idea = ({ idea }) => {
  return (
    <li className="idea">
      <h1 className="ideaTopBar">
        <div>
          {idea.name || 'No Title'} <span className="score">{idea.score || 0}</span>
        </div>
        <div>
          <button>upvote</button><button>downvote</button>
        </div>

      </h1>
      <div className="ideaContentArea">
        <h2 className="ideaAuthor">{`Suggested by ${idea.creator.name || 'no one'}`}</h2>
        <p>{idea.description}</p>
      </div>
      <ul>{idea.comments.map(comment => <Comment key={comment.id} comment={comment} />)}</ul>
    </li>
  )
}

const denormalize = ([ideas, comments, people]) => {
  return {
    ideas: ideas.map(idea => ({
      ...idea,
      creator: idea.creator ? people.find(person => person.id === idea.creator[0]) : 'No one',
      comments: idea.comments ? comments.filter(comment => idea.comments.includes(comment.id)) : [],
    })),
    people,
    comments
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [] }
  }

  componentDidMount() {
    Promise.all([
      getIdeas(),
      getComments(),
      getPeople()
    ])
      .then(denormalize)
      .then(({ ideas, comments, people }) => {
        console.log(ideas)
        this.setState({ ideas })

      })
  }

  render() {
    return (
      <ul>{this.state.ideas.map(idea => <Idea idea={idea} />)}</ul>
    );
  }
}

export default App;
