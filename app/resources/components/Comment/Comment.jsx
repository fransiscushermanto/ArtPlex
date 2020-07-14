import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import Moment from "react-moment";
import Avatar from "react-avatar";
const Comment = ({ commenter, comment_publish_time, comment_body, style }) => {
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

  return (
    <div className="comment-wrapper d-flex flex-row">
      <Avatar
        round={"40px"}
        size={"40px"}
        name={commenter}
        className="profile-avatar"
        maxInitials={2}
      />
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
    </div>
  );
};

export default Comment;
