import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import Moment from "react-moment";
import {
  Clear,
  ArrowRightAlt,
  Delete,
  Edit,
  Check,
  Warning,
  AddCircleOutline,
} from "@material-ui/icons";
import { red, green, grey } from "@material-ui/core/colors";
import { ProgressBar } from "react-bootstrap";
import { useForm } from "react-hook-form";

export function formatSlashDate(date) {
  const temp = new Date(date);

  return `${temp.getDate().toString().length > 1 ? "" : 0}${temp.getDate()}/${
    temp.getMonth().toString().length > 1 ? "" : 0
  }${temp.getMonth()}/${temp.getFullYear()}`;
}

export function escapeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<div><br><\/div>/g, "\n")
    .replace(/<div>/g, "\n")
    .replace(/<\/div>/g, "")
    .replace(/<br>/g, "\n")
    .replace(/&nbsp;/, " ")
    .replace(/<p>/, "")
    .replace(/<\/p>/, "")
    .replace(/<h1>/, "")
    .replace(/<\/h1>/, "");
}

export function restrictedKey(keyCode) {
  const arrKey = [
    { key: 18, status: false },
    { key: 37, status: false },
    { key: 38, status: false },
    { key: 39, status: false },
    { key: 40, status: false },
    { key: 20, status: false },
    { key: 17, status: false },
    { key: 46, status: false },
    { key: 35, status: false },
    { key: 27, status: false },
    { key: 112, status: false },
    { key: 113, status: false },
    { key: 114, status: false },
    { key: 115, status: false },
    { key: 116, status: false },
    { key: 117, status: false },
    { key: 118, status: false },
    { key: 119, status: false },
    { key: 120, status: false },
    { key: 121, status: false },
    { key: 122, status: false },
    { key: 123, status: false },
    { key: 36, status: false },
    { key: 144, status: false },
    { key: 33, status: false },
    { key: 34, status: false },
    { key: 16, status: false },
    { key: 91, status: false },
  ];

  const res = arrKey.filter((key) => key.key === keyCode);

  return res.length > 0 ? res[0].status : true;
}

export function detectOnBlur(ref, state, setState) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (state === true) {
        setState(false);
      }
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
}

export function calculateSpeed(length) {
  const perMinute = 200;
  return Math.round(length / perMinute);
}

export function calculateUsedTags(totalUsedStory, totalStory) {
  return (totalUsedStory / totalStory) * 100;
}

export const CommentDetail = ({
  commenter,
  username,
  comment_body,
  created_at,
  last_update,
  setOpenDetail,
}) => (
  <div className="comment-detail">
    <div className="inner-comment-detail">
      <header>
        <span onClick={() => setOpenDetail(false)}>
          <Clear />
        </span>
      </header>
      <div className="form-group">
        <label>Created By: </label>
        <div className="commenter ml-1">{commenter}</div>
      </div>
      <div className="form-group">
        <label>Username:</label>
        <div className="username ml-1">{username}</div>
      </div>
      <div className="form-group flex-column">
        <label>Comment Body:</label>
        <ReactQuill
          className="body-comment"
          id="comment-body"
          value={comment_body}
          modules={{ toolbar: false }}
          theme="bubble"
        />
      </div>
      <div className="form-group">
        <label>Created At:</label>
        <Moment fromNow>{created_at}</Moment>
      </div>
      <div className="form-group">
        <label>Last Updated:</label>
        <Moment fromNow>{last_update}</Moment>
      </div>
    </div>
  </div>
);

export const CategoryCard = ({
  totalStory,
  totalUsedStory,
  tag,
  editState,
  deleteState,
  addState,
  openEditPane,
  openDeletePane,
  onCancelAddCard,
  category,
  saveEdit,
  saveDelete,
  saveNewCard,
  tempSaveNewCard,
  searchCategories,
}) => {
  const [number, setNumber] = useState(0);
  const [tagName, setTagName] = useState("");
  const { register, handleSubmit } = useForm();
  let timer;
  const counter = (start, end, duration) => {
    let current = Math.floor(start),
      range = end - start,
      increment = end > start ? 1 : 0,
      step = Math.abs(Math.floor(duration / range));

    timer = setInterval(() => {
      current += increment;
      if (current == Math.floor(end)) {
        clearInterval(timer);
      }
      setNumber(current);
    }, step);
  };

  useEffect(() => {
    const abortController = new AbortController();
    let mount = true;
    if (mount) {
      clearInterval(timer);
      if (category.category_id !== null) {
        counter(0, calculateUsedTags(totalUsedStory, totalStory), 10);
      }

      setTagName(tag);
    }
    return () => {
      abortController.abort();
      mount = false;
    };
  }, [category]);

  useEffect(() => {
    setTagName(tag);
  }, [tag]);

  useEffect(() => {
    const abortController = new AbortController();
    if (calculateUsedTags(totalUsedStory, totalStory) < number) {
      counter(0, calculateUsedTags(totalUsedStory, totalStory), 10);
    }
    return () => abortController.abort();
  }, [number]);

  const onChange = (value) => {
    setTagName(value);
  };

  return (
    <div className="category-card card transparent">
      <div className="card-body">
        {addState ? (
          <>
            <div className="title">
              <span>Insert Tag</span>
            </div>
            <input
              type="text"
              className="form-control add-category"
              value={tagName}
              name="tag"
              ref={register({ required: true })}
              autoFocus
              onChange={(e) => {
                onChange(e.target.value);
                tempSaveNewCard(category, e.target.value);
              }}
            />
            <div className="action-btn d-flex justify-content-end align-items-center">
              <Clear
                style={{ color: red[500], cursor: "pointer" }}
                onClick={() => onCancelAddCard(category)}
              />
              <Check
                style={{ color: green[500], cursor: "pointer" }}
                onClick={() => {
                  handleSubmit(saveNewCard(category));
                }}
              />
            </div>
          </>
        ) : (
          <>
            {editState ? (
              <div className="action-btn d-flex justify-content-end align-items-center">
                <Clear
                  style={{ color: red[500], cursor: "pointer" }}
                  onClick={() => openEditPane(category)}
                />
                <Check
                  style={{ color: green[500], cursor: "pointer" }}
                  onClick={() => {
                    if (saveEdit(category, tagName)) {
                      openEditPane(category);
                    }
                  }}
                />
              </div>
            ) : null}

            <div className="title mt-auto">
              {editState ? (
                <input
                  type="text"
                  className="form-control"
                  value={tagName}
                  autoFocus
                  onChange={(e) => onChange(e.target.value)}
                />
              ) : (
                <span title={tag}>{tag}</span>
              )}
            </div>
            <ProgressBar
              className={category.tag}
              animated
              now={number}
              label={`${number}%`}
            />
            <div className="action-btn mt-auto">
              <span
                className="edit d-flex flex-row align-items-center"
                onClick={() => openEditPane(category)}
              >
                <Edit style={{ fontSize: "15px" }} />
              </span>
              <span
                className="delete d-flex flex-row align-items-center"
                onClick={() => openDeletePane(category)}
                style={
                  editState ? { cursor: "none", pointerEvents: "none" } : null
                }
              >
                <Delete style={{ fontSize: "15px" }} />
              </span>
              <span className="see-detail d-flex flex-row align-items-center ml-auto">
                <span style={{ fontSize: "10px" }}>See Details</span>{" "}
                <ArrowRightAlt style={{ fontSize: "15px" }} />
              </span>
            </div>
            {deleteState ? (
              <div className="confirmation">
                <div className="warning-icon">
                  <Warning style={{ color: grey[50] }} />
                </div>
                <div className="confirmation-text">
                  <div className="title">
                    <span>
                      Delete will affect to related stories, are you sure to
                      delete
                      <div>
                        <div>
                          <span>"{tag}</span>
                        </div>
                        " ?
                      </div>
                    </span>
                  </div>
                </div>
                <div className="action-btn decision-btn d-flex flex-row justify-content-center">
                  <button
                    className="btn"
                    onClick={() => {
                      if (saveDelete(category)) openDeletePane(category);
                    }}
                  >
                    YES
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => openDeletePane(category)}
                  >
                    NO
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export const AddCategoryCard = ({ onAddCard }) => {
  return (
    <div className="category-card card">
      <div className="card-body d-flex align-items-center justify-content-center">
        <AddCircleOutline
          onClick={onAddCard}
          style={{ fontSize: "30px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
