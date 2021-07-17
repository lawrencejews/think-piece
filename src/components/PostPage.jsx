import React, { Component } from 'react';

import Post from './Post';
import { firestore } from 'firebase';
import { collectIdsAndDocs } from '../utilities';

import { withRouter } from 'react-router-dom';
import Comments from './AddComment';
import withUser from './withUser';



class PostPage extends Component {
    state = { post: null, comment: [] };

    //These helper functions are building from each downwards.
    get postId() {
        return this.props.match.params.id;
    }

    get postRef() {
        return firestore.doc(`posts/${this.postId}`);
    }

    get commentRef() {
        return firestore.collection('comments');
    }

    unsubscribeFromPost = null;
    unsubscribeFromComments = null;

    componentDidMount = async () => {
        this.unsubscribeFromPost = this.postRef.onSnapshot(snapshot => {
            const post = collectIdsAndDocs(snapshot);
            this.setState({ post });
        })

        this.unsubscribeFromComments = this.commentRef.onSnapshot(snapshot => {
            const comments = snapshot.docs.map(collectIdsAndDocs);
            this.setState({ comments});
        })
    }

    componentWillUnmount = () => {
        this.unsubscribeFromPost();
        this.unsubscribeFromComments();
    }

    createComment = (comment) => {
        const { user } = this.props;
        this.commentRef.add({
            ...comment,
            user
        });
    }

    render() {
        const { post, comments } = this.state;
        return (
            <section>
                {post && <Post {...post} />}
                <Comments 
                comments={comments}
                postId={post.id}
                onCreate={this.createComment} />    
           </section>
        )
    }
}
export default withRouter(withUser((PostPage)));