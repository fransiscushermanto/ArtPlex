import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { detectOnBlur, calculateSpeed } from "../Function/Factories";
const Story = ({
  title,
  body,
  total_word,
  last_update,
  publish_date,
  story_id,
  status,
  setModal,
  setStoryId,
  author,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    detectOnBlur(dropdownRef, dropdown, setDropdown);
  }, [dropdownRef, dropdown]);
  const cutTitle = (title) => {
    const arrTitle = title.split(" ");
    const length = arrTitle.length;
    var fix = "";
    if (length > 8) {
      for (let i = 0; i < 8; i++) {
        if (i < 1) {
          fix = arrTitle[i];
        } else {
          fix += ` ${arrTitle[i]}`;
        }
      }
    } else {
      fix = title;
    }
    return fix;
  };

  const cutBody = (body) => {
    const arrBody = body.split(" ");
    const length = arrBody.length;
    var fix = "";
    if (length > 17) {
      for (let i = 0; i < 17; i++) {
        if (i < 1) {
          fix = arrBody[i];
        } else if (i < 16) {
          fix += ` ${arrBody[i]}`;
        } else {
          fix += ` ${arrBody[i]}...`;
        }
      }
    } else {
      fix = body;
    }
    return fix;
  };

  const deleteTrigger = () => {
    setDropdown(!dropdown);
    setStoryId(story_id);
    setModal(true);
  };

  return (
    <div className="story">
      <div className="col">
        <div className="row">
          <div className="header">
            <div className="title">
              <Link
                className="no-animation"
                to={
                  status === "off"
                    ? `/p/${story_id}/edit`
                    : `/@${author}/${story_id}`
                }
              >
                <span id="title-place">
                  {title !== "\n" ? cutTitle(title) : "Untitled"}
                </span>
              </Link>
            </div>
            <div className="body">
              <Link
                className="no-animation"
                to={
                  status === "off"
                    ? `/p/${story_id}/edit`
                    : `/@${author}/${story_id}`
                }
              >
                <span id="body-place">{cutBody(body)}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="footer">
            <div className="last-updated">
              {status === "on" ? (
                <p>
                  Published at{" "}
                  <Moment format="dddd, DD MMMM YYYY HH:m a">
                    {publish_date}
                  </Moment>
                </p>
              ) : (
                <p>
                  Last edited about <Moment fromNow>{last_update}</Moment>
                </p>
              )}
            </div>
            <div className="seperator">
              <div className="gd ge r">
                <span className="r">
                  <span className="bw b bx by bz ca r cb cc">·</span>
                </span>
              </div>
            </div>
            <div className="read-speed">
              <p>{`${calculateSpeed(Number.parseInt(total_word))} min read ${
                status === "on" ? "" : ` (${total_word} word) so far`
              } `}</p>
            </div>
          </div>
          <div className="action-btn">
            <span className="bw b bx by bz ca r cb cc">
              <div className="gf n o">
                <div className="ck" aria-hidden="true">
                  <button
                    onClick={() => setDropdown(dropdown ? false : true)}
                    className="ct cu bg bh bi bj bk bl bm bn cv cw bq cx cy"
                  >
                    <svg width="21" height="21" viewBox="0 0 21 21">
                      <path
                        d="M4 7.33L10.03 14l.5.55.5-.55 5.96-6.6-.98-.9-5.98 6.6h1L4.98 6.45z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </span>

            {dropdown ? (
              <div className="dropdown" ref={dropdownRef}>
                <div className="dropdown-wrapper">
                  <ul>
                    <li>
                      <Link
                        to={`/p/${story_id}/edit`}
                        className="no-animation story-action-btn"
                      >
                        Edit {status === "on" ? "Story" : "Draft"}
                      </Link>
                    </li>
                    <li>
                      <span
                        onClick={deleteTrigger}
                        className="no-animation story-action-btn"
                      >
                        Delete {status === "on" ? "Story" : "Draft"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="s gz hz hb ia hc hd he hf ht ib ic pinpoint"></div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

Story.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Story;
