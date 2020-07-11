import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Delete, WarningOutlined, Clear, Check } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { red, grey } from "@material-ui/core/colors";

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
  const accessTime = useRef("");
  useEffect(() => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://timeapi.herokuapp.com/utc/now";

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
      setListData({
        stories: res.data.stories,
        comments: [],
      });
    });
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
    if (res.data.success) {
      setListData({
        stories: [...listStoryData],
        comments: res.data.comments,
      });
    } else {
      setListData({
        stories: [...listStoryData],
        comments: [],
      });
    }
  };

  const deleteComment = async (comment_id) => {
    const data = new FormData();
    data.append("comment_id", comment_id);
    const res = await axios.post("/api/actions/delete_comment.php", data);
    console.log(res.data);
    if (res.data.success) {
      setListData({
        stories: [...listStoryData],
        comments: listCommentData.filter(
          (data) => data.comment_id !== comment_id
        ),
      });
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
    if (reload) {
      setHasMore(false);
      axios.get("/api/actions/get_list_story.php").then((res) => {
        setListData({
          stories: res.data.stories,
          comments: [],
        });
      });
      if (accessTime.current !== "") {
        const data = new FormData();
        if (searchComments !== "") {
          data.append("comment", searchComments);
        }
        data.append("story_id", watch("story_id"));
        data.append("access_time", accessTime.current);
        axios.post("/api/actions/get_more_comment.php", data).then((res) => {
          setListData({
            stories: [...listStoryData],
            comments: res.data.comments,
          });
          setReload(false);
          setHasMore(true);
        });
      }
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
    // console.log(listCommentData, searchComments, listStoryData);
    if (listCommentData.length >= limit && listCommentData) {
      const currentpage = Math.round(listCommentData.length / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchComments !== "") {
          data.append("comment", searchComments);
        }
        data.append("story_id", watch("story_id"));
        data.append("page", currentpage);
        data.append("access_time", accessTime.current);

        const res = await axios.post("/api/actions/get_more_comment.php", data);
        console.log(res.data);
        if (res.data.success) {
          if (res.data.comments.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
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

  return (
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
            listCommentData.map((comment) => {
              return (
                <div
                  key={comment.comment_id}
                  className="inner-comment-list-wrapper"
                >
                  <Comment
                    comment_body={comment.comment_body}
                    comment_id={comment.comment_id}
                    comment_publish_time={comment.publish_date}
                    commenter={comment.comment_name}
                    comment_status={comment.status}
                    comment_user_id={comment.user_id}
                  />
                  <div className="action-btn">
                    <span>
                      <Delete
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setTempCommentData(comment);
                        }}
                      />
                    </span>
                  </div>
                </div>
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
              <span>{tempCommentData.comment_body}</span>
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
  );
};

export default CommentList;
