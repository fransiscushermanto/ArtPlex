import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Delete,
  WarningOutlined,
  Clear,
  Check,
  InfoOutlined,
} from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { red, grey } from "@material-ui/core/colors";

import { CommentDetail } from "../../Function/Factories";
import Comment from "../../Comment/Comment";
const CommentList = ({
  user,
  setStatusAction,
  statusAction,
  setTempCommentData,
  tempCommentData,
  reload,
  setReload,
  searchComments,
  listCommentData,
  listStoryData,
  setListData,
}) => {
  const { register, handleSubmit, watch } = useForm();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const accessTime = useRef("");
  const commentLength = useRef(0);
  const deletedNumber = useRef(0);
  useEffect(() => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://timeapi.herokuapp.com/utc/now";
    let mount = true;
    axios
      .get(proxyurl + url, {
        headers: {
          "x-apikey": "59a7ad19f5a9fa0808f11931",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((time) => (accessTime.current = new Date(time.data.dateString)));

    axios.get("/api/actions/get_list_story.php").then((res) => {
      if (mount) {
        setListData({
          stories: res.data.stories,
          comments: [],
        });
      }
    });
    return () => (mount = false);
  }, []);

  const onStoryTitleChange = async (formData) => {
    document.getElementById("tabular-scroll").scrollTop = 0;
    setHasMore(true);
    const data = new FormData();
    if (searchComments !== "") {
      data.append("comment", searchComments);
    }
    data.append("story_id", formData.story_id);
    data.append("access_time", accessTime.current);
    const res = await axios.post("/api/actions/get_more_comment.php", data);
    commentLength.current = res.data.comments.length;
    if (res.data.success) {
      setListData({
        stories: [...listStoryData],
        comments: res.data.comments,
      });
    } else {
      setListData({
        stories: [...listStoryData],
        comments: res.data.comments,
      });
    }
  };

  const deleteComment = async (comment_id) => {
    const data = new FormData();
    data.append("comment_id", comment_id);
    const res = await axios.post("/api/actions/delete_comment.php", data);
    if (res.data.success) {
      setListData({
        stories: [...listStoryData],
        comments: listCommentData.filter(
          (data) => data.comment_id !== comment_id
        ),
      });
      deletedNumber.current++;
      setHasMore(true);
      setStatusAction({
        open: true,
        message: "Delete Success",
        severity: "success",
      });
    } else {
      setStatusAction({
        open: true,
        message: res.data.error,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (reload && accessTime.current !== "") {
      document.getElementById("tabular-scroll").scrollTop = 0;
      setHasMore(false);
      axios.get("/api/actions/get_list_story.php").then((res) => {
        setListData({
          stories: res.data.stories,
          comments: [...listCommentData],
        });
      });

      const data = new FormData();
      if (searchComments !== "") {
        data.append("comment", searchComments);
      }
      data.append("story_id", watch("story_id"));
      data.append("access_time", accessTime.current);
      axios.post("/api/actions/get_more_comment.php", data).then((res) => {
        commentLength.current = res.data.comments.length;
        setListData({
          stories: [...listStoryData],
          comments: res.data.comments,
        });
        setReload(false);
        setHasMore(true);
      });
    }
  }, [reload, accessTime.current]);

  useEffect(() => {
    if (searchComments !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("comment", searchComments);
      data.append("story_id", watch("story_id"));
      data.append("access_time", accessTime.current);
      axios.post("/api/actions/get_more_comment.php", data).then((res) => {
        setListData({
          comments: res.data.comments,
          stories: [...listStoryData],
        });
      });
    } else {
      setReload(true);
    }
  }, [searchComments]);

  async function handleScroll() {
    const ele = document.getElementById("tabular-scroll");
    if (ele.offsetHeight + Math.ceil(ele.scrollTop) < ele.scrollHeight) {
      return;
    }
    const limit = 10;
    console.log(listCommentData, commentLength.current);
    if (commentLength.current >= limit && listCommentData) {
      const currentpage = Math.round(commentLength.current / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchComments !== "") {
          data.append("comment", searchComments);
        }
        data.append("story_id", watch("story_id"));
        data.append("page", currentpage);
        data.append("access_time", accessTime.current);
        data.append("deleted_number", deletedNumber);
        const res = await axios.post("/api/actions/get_more_comment.php", data);
        if (res.data.success) {
          if (res.data.comments.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          commentLength.current += res.data.comments.length;
          let tempComments = [...listCommentData];
          res.data.comments.map((story) => {
            tempComments.push(story);
          });
          setListData({
            comments: tempComments,
            stories: [...listStoryData],
          });
        }
      }
    }
  }

  useEffect(() => {
    const ele = document.getElementById("tabular-scroll");
    ele.addEventListener("scroll", handleScroll);
    return () => ele.removeEventListener("scroll", handleScroll);
  }, [listCommentData, hasMore, listStoryData]);

  useEffect(() => {
    if (openDeleteModal) {
      document.getElementById("comment-delete-body").innerHTML =
        tempCommentData.comment_body;
    }
  }, [openDeleteModal, tempCommentData]);

  return (
    <>
      {openDetail ? (
        <CommentDetail
          commenter={tempCommentData.comment_name}
          username={tempCommentData.comment_username}
          comment_body={tempCommentData.comment_body}
          created_at={tempCommentData.publish_date}
          last_update={tempCommentData.last_updated}
          setOpenDetail={setOpenDetail}
        />
      ) : null}
      <div className="inner-action-pane comment-pane" id="tabular-scroll">
        <header className="width-100">
          <div className="form-group">
            <label>Story: </label>
            {listStoryData ? (
              <select
                ref={register}
                name="story_id"
                id=""
                className="form-control"
                onChange={handleSubmit(onStoryTitleChange)}
              >
                <option value="none">-</option>
                {listStoryData.map((story, index) => {
                  return (
                    <option key={index} value={story.story_id}>
                      {story.title}
                    </option>
                  );
                })}
              </select>
            ) : null}
          </div>
        </header>
        <div className="comment-list-wrapper">
          {listCommentData ? (
            listCommentData.length > 0 ? (
              listCommentData.map((comment, index) => {
                return (
                  console.log(comment),
                  (
                    <div key={index} className="inner-comment-list-wrapper">
                      <Comment
                        comment_body={comment.comment_body}
                        comment_id={comment.comment_id}
                        comment_publish_time={comment.publish_date}
                        commenter={comment.comment_name}
                        comment_status={comment.status}
                        comment_user_id={comment.user_id}
                        style={{ cursor: "none", pointerEvents: "none" }}
                      />
                      <div className="action-btn">
                        <span>
                          <Delete
                            onClick={() => {
                              setOpenDeleteModal(false);
                              setOpenDeleteModal(true);
                              setTempCommentData(comment);
                            }}
                          />
                        </span>
                        <span>
                          <InfoOutlined
                            title="Detail"
                            onClick={() => {
                              setOpenDetail(true);
                              setTempCommentData(comment);
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  )
                );
              })
            ) : (
              <div>
                <h1>No Comment found.</h1>
              </div>
            )
          ) : null}
        </div>
        {openDeleteModal ? (
          <div className="confirmation" style={{ backgroundColor: red[800] }}>
            <WarningOutlined style={{ color: grey[50], fontSize: "30px" }} />
            <span>
              Are you sure wish to delete the comment "
              <div>
                <span id="comment-delete-body"></span>
              </div>
              " by {tempCommentData.comment_name} ?
            </span>
            <div className="action-btn ">
              <span
                style={{ background: grey[50], borderRadius: "20px" }}
                onClick={() => setOpenDeleteModal(false)}
              >
                <Clear style={{ color: red[800], fontSize: "20px" }} />
              </span>
              <span
                style={{ background: grey[50], borderRadius: "20px" }}
                onClick={() => {
                  setOpenDeleteModal(false);
                  deleteComment(tempCommentData.comment_id);
                }}
              >
                <Check style={{ color: red[800], fontSize: "20px" }} />
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CommentList;
