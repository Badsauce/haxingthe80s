import React, { Component } from 'react';
import './App.css';

Idea = ({ name, description, score, comments, creator }) => {
    return (
      <div className="idea">
        <h1>{`${name} | ${score}`}</h1>
        <h2>{`Suggested by ${creator}`}</h2>
        <p>{description}</p>
      </div>
      {comments.map((comment) => {
        return <Comment author={comment.author} content={comment.content} />
      })}
    );
  }
}

Comment = ({ author, content}) => {
  <div>
    <h1>Author</h1>
    <p>content</p>
  </div>
}

export default Idea;
