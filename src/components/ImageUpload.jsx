import React from 'react'
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from '../firebase.js';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload(props) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (event) => {
        if(event.target.files[0])
        setImage(event.target.files[0]);
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);  // file.name

        uploadTask.on("state_changed", (snapshot) => {
            // progress thing
            const progress = Math.round( (snapshot.bytesTransferred/snapshot.totalBytes)*100 );
            setProgress(progress);
        }, (error) => {
            // error thing
            console.log(error);
            alert(error.message);
        }, () => {
            // done thing
            storage
            .ref("images")  // images is a folder we created in the storage
            .child(image.name)
            .getDownloadURL()   // the put() at first of this function uploads the file, this line returns it's url
            .then(url => {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    imageURL: url,
                    caption: caption,
                    username: props.username
                })
                setProgress(0);
                setImage(null);
                setCaption("");
            })
        });
    };

    return (
        <div className="imageupload">
            {/* input caption */}
            <input
            type="text"
            placeholder="Enter a caption..."
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            /><br/>
            {/* input file */}
            <input type="file" onChange={handleChange} />
            {/* post button */}
            <Button onClick={handleUpload}>Post</Button><br/>
            {/* progress bar */}
            <progress value={progress} max="100"/>
        </div>
    )
}

export default ImageUpload
