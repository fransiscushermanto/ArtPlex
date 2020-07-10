import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import Avatar from "react-avatar";
import axios from "axios";

import Comment from "./Comment";
import { escapeHtml } from "../Function/Factories";

const CommentGroup = ({
  user,
  story_id,
  comments,
  setStoryInfo,
  storyInfo,
}) => {
  const [bodyComment, setBodyComment] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  const handleChange = (e) => {
    setBodyComment(e);
  };

  const sendComment = async () => {
    const data = new FormData();
    data.append("user_id", user.id);
    data.append("body", bodyComment);
    data.append("story_id", story_id);
    const res = await axios.post("/api/actions/create_comment.php", data);
    console.log(res.data);
    if (res.data.success) {
      setBodyComment("");
      let temp = [...comments];
      temp.unshift(res.data.comment);
      setStoryInfo({ ...storyInfo, comments: temp });
    }
  };

  useEffect(() => {
    if (escapeHtml(bodyComment).length > 0) {
      if (escapeHtml(bodyComment) === "\n") {
        setShowLabel(true);
        setAllowSubmit(false);
      } else {
        setShowLabel(false);
        setAllowSubmit(true);
      }
    } else {
      setAllowSubmit(false);
      setShowLabel(true);
    }
  }, [bodyComment]);

  return (
    <div className="comment-editor-wrapper">
      <div className="comment-editor d-flex justify-content-center">
        <div className="row width-100">
          <Avatar
            round={"40px"}
            size={"40px"}
            name={user.name}
            className="profile-avatar"
            maxInitials={2}
          />
          <div className="col">
            <div className="wrapper-editable width-100">
              <ReactQuill
                className="comment-editable"
                value={bodyComment}
                onChange={handleChange}
                placeholder="Type a comment"
                modules={{ toolbar: false }}
                theme="bubble"
              />
            </div>
            <div className="row d-flex flex-row justify-content-end width-100">
              <button className="btn" onClick={() => setBodyComment("")}>
                CANCEL
              </button>
              <button
                className="btn submit"
                disabled={allowSubmit ? false : true}
                onClick={sendComment}
              >
                COMMENT
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="comment-list witdh-100">
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <Comment
                key={comment.comment_id}
                comment_body={comment.comment_body}
                comment_id={comment.comment_id}
                comment_publish_time={comment.publish_date}
                commenter={comment.comment_name}
                comment_status={comment.status}
                comment_user_id={comment.user_id}
              />
            );
          })
        ) : (
          <div className="no-comment width-100">
            <p>No Comment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentGroup;
