import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import Moment from "react-moment";
import Avatar from "react-avatar";
import axios from "axios";
import { MoreVert } from "@material-ui/icons";
import { detectOnBlur } from "../Function/Factories";
import CommentEditor from "./CommentEditor";
import DeleteModals from "../Modals/DeleteModals";
const Comment = ({
  user,
  commenter,
  comment_id,
  comment_publish_time,
  comment_body,
  comment_user_id,
  style,
  comment_object,
  comments_array,
  storyInfo,
  setStoryInfo,
}) => {
  const [openEditComment, setOpenEditComment] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [bodyComment, setBodyComment] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const editCommentQuillRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChange = (text, delta, source, editor) => {
    setBodyComment(text);
  };

  const saveComment = async () => {
    const data = new FormData();
    data.append("comment_id", comment_id);
    data.append("body", bodyComment);
    const res = await axios.post("/api/actions/update_comment.php", data);
    console.log(res.data);
    if (res.data.success) {
      let temp = [...comments_array];
      let index = temp.indexOf(comment_object);
      temp[index].comment_body = bodyComment;
      setStoryInfo({ ...storyInfo, comments: temp });
      setOpenEditComment(false);
    }
  };

  const deleteComment = async () => {
    const data = new FormData();
    data.append("comment_id", comment_id);
    const res = await axios.post("/api/actions/delete_comment.php", data);
    if (res.data.success) {
      setStoryInfo({
        ...storyInfo,
        comments: comments_array.filter(
          (comment) => comment.comment_id !== comment_id
        ),
      });
    }
  };

  useEffect(() => {
    if (openDeleteModal) {
      document.getElementById("ftco-navbar").style.display = "none";
    } else {
      document.getElementById("ftco-navbar").style.display = "flex";
    }
  }, [openDeleteModal]);

  useEffect(() => {
    if (editCommentQuillRef.current !== null) {
      if (
        editCommentQuillRef.current.editor.getText() === "\n" ||
        editCommentQuillRef.current.editor.getText() === ""
      ) {
        setAllowSubmit(false);
      } else {
        setAllowSubmit(true);
      }
    }
  }, [editCommentQuillRef, bodyComment]);

  useEffect(() => {
    detectOnBlur(dropdownRef, dropdown, setDropdown);
  }, [dropdownRef, dropdown]);

  useEffect(() => {
    setBodyComment(comment_body);
  }, [comment_body]);

  useEffect(() => {
    if (openEditComment) {
      editCommentQuillRef.current.editor.focus();
      editCommentQuillRef.current.editor.setSelection(
        0,
        editCommentQuillRef.current.editor.getText().length
      );
    }
  }, [openEditComment]);

  useEffect(() => {
    if (user) {
      if (user.id === comment_user_id) {
        setShowMoreButton(true);
      }
    }
  }, [comment_id, user]);

  return (
    <>
      {openDeleteModal ? (
        <DeleteModals
          text={"Are you sure you want to delete your comment permanently?"}
          setModal={setOpenDeleteModal}
          onClick={deleteComment}
        />
      ) : null}
      <div
        className="inner-comment-list-wrapper"
        style={{ position: "relative" }}
      >
        {showMoreButton ? (
          openEditComment ? null : (
            <div
              className="action-btn"
              style={{
                position: "absolute",
                right: "0",
                lineHeight: "1%",
              }}
            >
              <MoreVert
                style={{ cursor: "pointer", zIndex: "300" }}
                onClick={() => setDropdown(!dropdown)}
              />
            </div>
          )
        ) : null}

        {dropdown ? (
          <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-wrapper">
              <ul>
                <li>
                  <button
                    className="btn py-0 px-0"
                    onClick={() => {
                      setOpenEditComment(true);
                      setDropdown(false);
                    }}
                  >
                    EDIT
                  </button>
                </li>
                <li>
                  <button
                    className="btn py-0 px-0"
                    onClick={() => {
                      setOpenDeleteModal(true);
                      setDropdown(false);
                    }}
                  >
                    DELETE
                  </button>
                </li>
              </ul>
            </div>
            <div className="s gz hz hb ia hc hd he hf ht ib ic pinpoint"></div>
          </div>
        ) : null}
        <div className="comment-wrapper d-flex flex-row">
          <Avatar
            round={"40px"}
            size={"40px"}
            name={commenter}
            className="profile-avatar"
            maxInitials={2}
          />
          {openEditComment ? (
            <CommentEditor
              editor={
                <ReactQuill
                  ref={editCommentQuillRef}
                  className="comment-editable"
                  value={bodyComment}
                  onChange={handleChange}
                  placeholder="Type a comment"
                  modules={{ toolbar: false }}
                  theme="bubble"
                />
              }
              btn_negative_text={"CANCEL"}
              btn_positive_text={"SAVE"}
              setNegativeButton={() => setOpenEditComment(false)}
              setPositiveButton={saveComment}
              allowSubmit={allowSubmit}
            />
          ) : (
            <div className="col">
              <div className="wrapper-editable width-100">
                <div className="head d-flex flex-row align-items-center">
                  <div className="commenter-name">{commenter}</div>
                  <div className="comment-date ml-2">
                    <span>
                      <Moment interval={0} fromNow>
                        {comment_publish_time}
                      </Moment>
                    </span>
                  </div>
                </div>
                <div className="body-wrapper">
                  <ReactQuill
                    className="body-comment"
                    id="comment-body"
                    value={comment_body}
                    modules={{ toolbar: false }}
                    theme="bubble"
                    style={style}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;

// useEffect(() => {
//   const cutLongText = () => {
//     var limitChar = 400;
//     var ellipsestext = "...";
//     var body = document.getElementById("comment-body");
//     var content = body.innerHTML;
//     if (content.length > limitChar) {
//       var c = content.substr(0, limitChar);
//       var h = content;
//       var html =
//         '<div class="truncate-text" style="display:block">' +
//         c +
//         '<span class="moreellipses">' +
//         ellipsestext +
//         '&nbsp;&nbsp;<button class="moreless more">more</button></span></span></div><div class="truncate-text" style="display:none">' +
//         h +
//         '<button href="" class="moreless less">Less</button></span></div>';
//       body.innerHTML = html;
//     }
//   };
//   cutLongText();
// }, []);
