import React, { useEffect, useState } from "react"
import FlipMove from "react-flip-move";
import "./Feed.css";

import CreateIcon from "@mui/icons-material/Create";
import ImageIcon from "@mui/icons-material/Image";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import InputOptions from "./InputOption";
import Post from "./Post";

import firebase from 'firebase'
import { db } from "./firebase";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";


function Feed() {

  const user = useSelector(selectUser);

  const [input, setInput] = useState('')
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
    .orderBy("timeStamp","desc")
    .onSnapshot((snapshot) =>
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  const sendPost = (e) => {
    e.preventDefault();
    
    db.collection('posts').add({
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl:user.photoUrl || "",
      timeStamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setInput("")
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input">
          <CreateIcon />
          <form action="">
            <input value= {input} onChange= {e => setInput(e.target.value)} 
            type="text" placeholder="Start a post" />
            <button onClick={sendPost} type="submit">
              Send
            </button>
          </form>
        </div>
        <div className="feed__inputOptions">
          <InputOptions
            Icon={ImageIcon}
            title="Photo"
            color="rgb(112 181 249)"
          />
          <InputOptions
            Icon={SubscriptionsIcon}
            title="Video"
            color="rgb(127 193 94)"
          />
          <InputOptions
            Icon={BusinessCenterIcon}
            title="Job"
            color="rgb(168 212 255)"
          />
          <InputOptions
            Icon={NewspaperIcon}
            title="Write article"
            color="rgb(252 146 149)"
          />
        </div>
      </div>

      {/* post */}
      <FlipMove>
      {posts.map(({id , data: {name, description, message, photoUrl}}) => (
        <Post 
          key= {id}
          name={name}
          description={description}
          message={message}
          photoUrl={photoUrl}
       />
      ))}
      </FlipMove>
    </div>
  );
}

export default Feed;
