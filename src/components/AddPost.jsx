import { firestore } from 'firebase';
import React, { Component } from 'react';
import { auth } from '../firebase';

class AddPost extends Component {
  state = { title: '', content: '' };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { title, content } = this.state;
    const { uid, displayName, email, photoURL } = auth.currentUser || {};

    const post = {
      //id: Date.now().toString(), auto generated ids now not needed.
      title,
      content,
      user: {
        uid,
        displayName,
        email,
        photoURL, // This is used by firebase authentication.
      },
      favorites: 0,
      comments: 0,
      createdAt: new Date(),
    }

    firestore.collection('posts').add(post);

    this.setState({ title: '', content: '' });
  };

  render() {
    const { title, content } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="AddPost">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="content"
          placeholder="Body"
          value={content}
          onChange={this.handleChange}
        />
        <input className="create" type="submit" value="Create Post" />
      </form>
    );
  }
}

export default AddPost;
