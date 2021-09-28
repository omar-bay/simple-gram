import { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch( error => alert(error.message) );
    setOpenSignIn(false);
  };
  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch( error => alert(error.message) );
    setOpen(false);
  }

  useEffect(() => {
    db.collection('posts')
    .orderBy('timestamp', "desc")
    .onSnapshot(snapshot => {
      // setPosts(snapshot.docs.map( doc => doc.data() ))
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  // keep logged in after refresh
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // if user logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // if user logged out...
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [/*username,*/ user]);

  return (
    <div className="App">
      {/* Header */}
      <div className="div__header" >
        <img
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        className="img__headerLogo"
        />
        <div className="in_out">
        {
          user
          ?<Button onClick={() => auth.signOut()}>Logout</Button>
          :<div className="div__imin">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          </div>
        }
        </div>
      </div>

      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="form__signup_form">
          <center>
            <img
            src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-app-logo.jpg"
            width="119px"
            height="90px"
            /><br/>
            <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            ></Input>
            <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={event => setEmail(event.target.value)}
            />
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            /><br/>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </center>
          </form>
        </div>
      </Modal>

      <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="form__signup_form">
          <center>
            <img
            src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-app-logo.jpg"
            width="119px"
            height="90px"
            /><br/>
            <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={event => setEmail(event.target.value)}
            />
            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            /><br/>
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </center>
          </form>
        </div>
      </Modal>
      

      {/* Posts */}
      <div className="div__renderingposts">
        {
         posts.map( ({id, post}) => 
          <Post
          key={id}
          username={post.username}
          imageURL={post.imageURL}
          caption={post.caption}
          postId={id}
          user={user}
          />
          )
        }
      </div>

      {/* footer */}
      <div className="div__footer">
        {
          user
          ?<ImageUpload username={username/*.displayName*/}/>
          :<h3>Login to Upload</h3>
        }
      </div>
    </div>
  );
}

export default App;
