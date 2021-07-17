import React, { Component, createContext } from 'react';
import { auth, createUserProfileDocument } from '../firebase';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {
    state = { user: null };

    unsubscribeFromAuth = null;

  // Connecting with cloud firestore on firebase google.
  componentDidMount = async () => {
      this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
          if (userAuth) {
            const userRef = await createUserProfileDocument(userAuth);
              userRef.onSnapshot(snapshot => {
                  this.setState({ user: { uid: snapshot.id, ...snapshot.data() } })
              });
          }  
      this.setState({ user: userAuth });
    })
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  }

   // Persistent data entry to the database.
  // handleCreate = async post => {
  //   firestore.collection('posts').add(post);
  // };

  //Deleting a post from the database.
  // handleRemove = async id => {
  //   firestore.doc(`posts/${id}`).delete();
  // };
    
    render() {
        const { user } = this.state;
        const { children } = this.props;
        return (
            <UserContext.Provider value={user}>{ children}</UserContext.Provider>
        )
    }

}
export default UserProvider;