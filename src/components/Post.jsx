import React from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import firebase from 'firebase';

function Post(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const postComment = (event) => {
        event.preventDefault();
        if(!props.user)
        alert("Your should be signed in to post a comment!");
        else {
            db
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .add({
                text: comment,
                username: props.user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        setComment('');
    }

    useEffect(() => {
        let unsubscribe;
        if(props.postId) {
            unsubscribe = db
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()));
            });
        }
        return () => {unsubscribe();};
    }, [props.postId]);

    return (
        <div className="post">
            {/* header: avatar + usename */}
            <div className="div__headerpost">
                <Avatar
                className="Avatar__uname"
                alt="avatar"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXs8PGxxc3I1tvp7u+2ydDa4+bV3+Ph6Oqzxs67zdO/z9Xi6eutwsvQ3ODm7O7X4eTL2Nwvk4y4AAADE0lEQVR4nO3c23qjIBSG4QKCe839X211ks7YTGJk1YiLfu+Bx/wPe0E/PgAAAAAAAAAAAAAAAAAAAAAAAJCIG3zorbV98INLXZj9udHWhek6Y+ZHUdsxr5DemjnbUmdsmbpYuxlr81g9pi7aLsrmSb5Zk0E99tVKQGOqPnUBf8g19/3vXteoHnLa9Qq8VeOQuphyZbEhoDGF2s7Ybgs4RWxTF1Vm2BpwmjZ0NtRns+DDiKkLK9G/GkWXOoWTRhmRb6avK66tZB5pUhc4lo8MaIxPXeRIMcPMlbLBJr4KtVWiFSS0qQsdwwkCmkrTEnyUJDSa9sOSRqqrmW5fkS4pGk1F3XCipyOWMUvSfzo9+8RRmFDPjBiECUPqgm8WtXFaJNSzhSKh/oT590Of/Via/3w4iAJqWtMIdvgzRevSX7C3kO0P9Qw0U0fccuZ0T9cZVPbvaX7Bu7boV976Xnrn/847/3OLjzYyoaqB9Cru/FDPtmIhpp3qa6Oz/M/x87+LsTmi3oBTxC3bKK1N9Mq9Hm5032ub9C8C6nm/9tSwcj2xa1S30L/8s6baqFuLPuXt/6NqkdE979kw2uW4Wtsxj/b5nSt96Ps++FL78AkAAAAgETe0pR9D+LO3CGH0ZZvL99xuKMOlqYvq/lS4qoq6uYRSdVDXhvkT9XVFbUOrMqXz06Z+2+FMN235vbKQbmyquHtRXdUEPSG9lVzFmLqmVfHuzQXZhair+vQV6fpCdmvvS1ecO2P4Yb5bxtQxnvI75LtmPGd/XP3/RazmhEeKL/5/Eet0/8tYO2CSOdmx1F498FvEM/XGy+7xri6pg9042Y3gLewp5sbXv6CRO8XPa1z9voCniDi8YYz5FrFIPKQ62fewMYqktfjOPvglbUO17w84RUx4xV34FV50xGQrOMmFfJlEqxvRZyMyiQbUPXdLryS5Qyz8jFImxceXB8yESwna6eXIKpwq8fh9xvs2FI8dPymSkIQkJCEJSUhCEpJQRcKDV97HJxztsTT9VBEAAAAAAAAAAAAAAAAAAAAAAODUPgFyNSYEPFPakAAAAABJRU5ErkJggg=="
                />
                <h3>{props.username}</h3>
            </div>

            {/* image */}
            <img
            src={props.imageURL}
            className="img__post"
            />

            {/* username + caption */}
            <h4 className="h4__combar"><strong>{props.username+":"}</strong>{" "+props.caption}</h4>

            {/* others' comments */}
            <div>
                <h5 className="h5__combar">
                {
                    comments.map((comment) => (
                       <p>
                           <strong>{comment.username} </strong>{comment.text}
                       </p>
                    ))
                }
                </h5>
            </div>

            {/* comments section */}
            <form className="form__commentsection">
                <input
                type="text"
                placeholder="Add Comment..."
                value={comment}
                onChange={event => setComment(event.target.value)}
                className="input__commentsection"
                />
                <button
                disabled={!comment}
                type="submit"
                onClick={postComment}
                className="button__commentsection"
                >Post
                </button>
            </form>
        </div>
    )
}

export default Post
