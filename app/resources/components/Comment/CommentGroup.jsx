import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Avatar from "react-avatar";
import axios from "axios";

import Comment from "./Comment";
import CommentEditor from "./CommentEditor";

const CommentGroup = ({
  user,
  story_id,
  comments,
  setStoryInfo,
  storyInfo,
  deletedNumber,
}) => {
  const [bodyComment, setBodyComment] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const commentQuillRef = useRef(null);
  const handleChange = (text, delta, source, editor) => {
    setBodyComment(text);
  };

  const sendComment = async () => {
    const data = new FormData();
    data.append("user_id", user.id);
    data.append("body", bodyComment);
    data.append("story_id", story_id);
    const res = await axios.post("/api/actions/create_comment.php", data);
    // console.log(res.data);
    if (res.data.success) {
      setBodyComment("");
      let temp = [...comments];
      temp.unshift(res.data.comment);
      setStoryInfo({ ...storyInfo, comments: temp });
    }
  };

  useEffect(() => {
    if (
      commentQuillRef.current.editor.getText() === "\n" ||
      commentQuillRef.current.editor.getText() === ""
    ) {
      setAllowSubmit(false);
    } else {
      setAllowSubmit(true);
    }
  }, [commentQuillRef, bodyComment]);

  return (
    <div className="comment-editor-wrapper">
      <div className="comment-editor d-flex justify-content-center">
        {user === null ? (
          <div className="row width-100"></div>
        ) : (
          <div className="row width-100">
            <Avatar
              round={"40px"}
              size={"40px"}
              name={user.name}
              className="profile-avatar"
              maxInitials={2}
            />
            <CommentEditor
              editor={
                <ReactQuill
                  ref={commentQuillRef}
                  className="comment-editable"
                  value={bodyComment}
                  onChange={handleChange}
                  placeholder="Type a comment"
                  modules={{ toolbar: false }}
                  theme="bubble"
                />
              }
              btn_negative_text={"CANCEL"}
              btn_positive_text={"COMMENT"}
              setNegativeButton={() => setBodyComment("")}
              setPositiveButton={sendComment}
              allowSubmit={allowSubmit}
            />
          </div>
        )}
      </div>
      <div className="comment-list witdh-100">
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            return (
              <Comment
                key={index}
                user={user}
                deletedNumber={deletedNumber}
                comment_object={comment}
                comments_array={comments}
                comment_menu={comment.menu}
                storyInfo={storyInfo}
                setStoryInfo={setStoryInfo}
                comment_body={comment.comment_body}
                comment_id={comment.comment_id}
                comment_publish_time={comment.publish_date}
                commenter={comment.comment_name}
                comment_status={comment.status}
                comment_user_id={comment.user_id}
                style={{ cursor: "none", pointerEvents: "none" }}
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
