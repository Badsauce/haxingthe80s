import React, { Component } from 'react';
import './App.css';
import { getIdeas, getComments, getPeople } from './api.js'

const Comment = ({ data }) => {
  return (
    <li>
      <span></span>
    </li>
  )
}

const Idea = ({ data }) => {
  return (
    <li>
      <span>{data.score || 0}</span>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <p>{data.creator.name}</p>
      <p>{data.comments.map(comment => <Comment key={comment.id} data={comment} />)}</p>
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
      <ul>{this.state.ideas.map(idea => <Idea data={idea} />)}</ul>
    );
  }
}

export default App;
