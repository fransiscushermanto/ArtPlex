import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Avatar from "react-avatar";
import Moment from "react-moment";
import styled from "styled-components";
import hljs from "highlight.js";
import ReactQuill, { Quill } from "react-quill";
import CircularProgress from "@material-ui/core/CircularProgress";

import CommentGroup from "../Comment/CommentGroup";
import { calculateSpeed } from "../Function/Factories";

hljs.configure({
  languages: [
    "javascript",
    "ruby",
    "python",
    "rust",
    "php",
    "html",
    "c#",
    "c",
    "css",
    "scss",
    "kotlin",
    "c++",
    "java",
    "typescript",
    "go",
    "nginx config",
    "swift",
    "Arduino",
    "Django",
  ],
});
const StoryView = ({ user }) => {
  const { storyId } = useParams();

  const [loading, setLoading] = useState(false);
  const [authorData, setAuthorData] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [storyInfo, setStoryInfo] = useState({
    publish_date: "",
    total_word: "0",
    categories: [],
    comments: [],
  });

  useEffect(() => {
    const getStory = async () => {
      const data = new FormData();
      data.append("story_id", storyId);
      data.append("type", "public");
      const res = await axios.post("/api/actions/get_story.php", data);
      console.log(res.data);
      if (res.data.success) {
        setAuthorData(res.data.author);
        setStoryInfo({
          publish_date: res.data.publish_date,
          total_word: res.data.total_word,
          categories: res.data.categories,
          comments: res.data.comments,
        });
        // loadToDOM(res.data.title_html, res.data.body_html);
        setTitle(res.data.title_html);
        setBody(res.data.body_html);
      }
    };
    getStory();
  }, []);

  async function handleScroll() {
    if (
      window.innerHeight + Math.floor(document.documentElement.scrollTop) !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    const limit = 10;
    if (storyInfo.comments.length >= limit) {
      const currentpage = Math.round(storyInfo.comments.length / limit);
      if (hasMore) {
        setLoading(true);
        const data = new FormData();
        data.append("story_id", storyId);
        data.append("page", currentpage);

        const res = await axios.post("/api/actions/get_more_comment.php", data);
        // console.log(res.data);
        if (res.data.success) {
          setLoading(false);
          if (res.data.comments.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          let tempComment = [...storyInfo.comments];
          res.data.comments.map((comment) => {
            tempComment.push(comment);
          });

          setStoryInfo({
            ...storyInfo,
            comments: tempComment,
          });
        }
      }
    }
  }

  useEffect(() => {
    console.log(storyInfo.comments);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    hasMore,
    storyInfo.comments,
    document.documentElement.scrollTop,
    loading,
  ]);

  return authorData ? (
    <div className="story-public container d-flex flex-column align-items-center mb-5 ">
      <div className="col d-flex flex-column align-items-center width-100">
        <ReactQuill
          className="title width-100"
          id="title"
          theme={"bubble"}
          value={title}
          modules={StoryView.titleModules}
          readOnly={true}
        />
        <div className="author-info d-flex justify-content-center width-100">
          <div className="row d-flex align-items-center">
            <Avatar
              round={"50px"}
              size={"50px"}
              name={authorData.name}
              className="profile-avatar"
              style={{ fontSize: "30px" }}
              maxInitials={2}
            />
            <div className="col d-flex flex-column justify-content-center">
              <div className="author-name">{authorData.name}</div>
              <div className="story-info d-flex flex-row align-items-center">
                <div className="last-updated">
                  <p>
                    <Moment format="MMM D">{storyInfo.publish_date}</Moment>
                  </p>
                </div>
                <div className="seperator">
                  <div className="gd ge r">
                    <span className="r">
                      <span className="bw b bx by bz ca r cb cc">·</span>
                    </span>
                  </div>
                </div>
                <div className="read-speed">
                  <p>{`${calculateSpeed(
                    Number.parseInt(storyInfo.total_word)
                  )} min read `}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReactQuill
          className="body width-100 d-flex flex-column align-items-center"
          id="body"
          theme={"bubble"}
          value={body}
          modules={StoryView.modules}
          readOnly={true}
        />
      </div>
      <div className="col d-flex flex-column align-items-center">
        <div className="tags d-flex width-100">
          <ul
            className="d-flex flex-row"
            style={{ padding: "0px", margin: "0px" }}
          >
            {storyInfo.categories.length > 0
              ? storyInfo.categories.map((category, index) => {
                  return (
                    <li
                      key={index}
                      style={{ listStyle: "none", margin: "0 6px 8px 0" }}
                    >
                      <Link
                        to={`/tag/${category.tag}`}
                        className="no-animation"
                      >
                        <Tag label={category.tag} {...category} />
                      </Link>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
        <div className="width-100 written-by d-flex align-items-start">
          <Avatar
            round={"80px"}
            size={"80px"}
            name={authorData.name}
            className="profile-avatar"
            maxInitials={2}
          />
          <div className="author-profile-info pl-3">
            <div className="x">
              <p>WRITTEN BY</p>
            </div>
            <div className="author-name">{authorData.name}</div>
            <div className="author-desc"> </div>
          </div>
        </div>
        <div className="comment width-100">
          <CommentGroup
            storyInfo={storyInfo}
            setStoryInfo={setStoryInfo}
            user={user}
            story_id={storyId}
            comments={storyInfo.comments}
          />
          {loading ? (
            <div className="loader widht-100 d-flex justify-content-center">
              <CircularProgress size="30px" color="inherit"></CircularProgress>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: rgba(242, 242, 242, 1);
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  padding: 5px 0px;
  box-sizing: content-box;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    padding: 5px 10px;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    color: rgba(117, 117, 117, 1) !important;
    // text-overflow: ellipsis;
  }

  & svg {
    font-size: 13px;
    cursor: pointer;
  }
`;

StoryView.modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: false,
};

StoryView.titleModules = {
  toolbar: false,
};

export default StoryView;
