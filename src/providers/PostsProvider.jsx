import React, { Component, createContext } from 'react';
import { firestore } from 'firebase';
import { collectIdsAndDocs } from '../utilities';

export const PostsContext = createContext();

class PostsProvider extends Component {
    state = { posts: [] }

    unsubscribeFromFirestore = null;

    // Connecting with cloud firestore on firebase google.
    componentDidMount = async () => {
        this.unsubscribeFromFirestore = firestore.collection('posts').onSnapshot(snapshot => {
            const posts = snapshot.docs.map(collectIdsAndDocs);
            this.setState({ posts })
        });
      
    }

    componentWillUnmount = () => {
    this.unsubscribe();
    }

    render() {
        const { posts } = this.state;
        const { children } = this.props;
        return (
            <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
        )
    }
       
}

export default PostsProvider;