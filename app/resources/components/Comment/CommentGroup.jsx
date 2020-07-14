import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import Avatar from "react-avatar";
import axios from "axios";
import { MoreVert } from "@material-ui/icons";

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
  const [showCommentMenu, setShowCommentMenu] = useState(true);

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
              <div
                className="inner-comment-list-wrapper"
                style={{ position: "relative" }}
              >
                <div
                  className="action-btn"
                  style={{
                    position: "absolute",
                    right: "0",
                    lineHeight: "1%",
                    zIndex: "1000",
                  }}
                >
                  <MoreVert
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowCommentMenu(!showCommentMenu)}
                  />
                  <div
                    className="dropdown"
                    //  ref={dropdownRef}
                  >
                    <div className="dropdown-wrapper">
                      <ul>
                        <li>HEHE</li>
                        <li>DELETE</li>
                      </ul>
                    </div>
                    <div className="s gz hz hb ia hc hd he hf ht ib ic pinpoint"></div>
                  </div>
                </div>
                <Comment
                  key={comment.comment_id}
                  comment_body={comment.comment_body}
                  comment_id={comment.comment_id}
                  comment_publish_time={comment.publish_date}
                  commenter={comment.comment_name}
                  comment_status={comment.status}
                  comment_user_id={comment.user_id}
                  style={{ cursor: "none", pointerEvents: "none" }}
                />
              </div>
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
