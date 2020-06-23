import React from "react";
import PropTypes from "prop-types";
const Story = ({ title, body }) => {
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
        console.log("i:", i, "text:", arrBody[i]);
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

  const totalWord = (title, body) => {
    const arrBody = body.split(" ");
    const bodyLength = arrBody.length;
    const arrTitle = title.split(" ");
    const titleLength = arrTitle.length;
    return `${calculateSpeed(bodyLength + titleLength)} min read (${bodyLength +
      titleLength} word) so far`;
  };

  const calculateSpeed = (length) => {
    const perMinute = 200;
    return length / perMinute;
  };

  return (
    cutTitle(title),
    (
      <div className="story">
        <div className="col">
          <div className="row">
            <div className="header">
              <div className="title">
                <span>{cutTitle(title)}</span>
              </div>
              <div className="body">
                <span>{cutBody(body)}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="footer">
              <div className="last-updated">
                <p>Last edited about 11 hours ago</p>
              </div>
              <div className="seperator">
                <div class="gd ge r">
                  <span class="r">
                    <span class="bw b bx by bz ca r cb cc">·</span>
                  </span>
                </div>
              </div>
              <div className="read-speed">
                <p>{totalWord(title, body)}</p>
              </div>
            </div>
            <div className="action-btn">
              <span class="bw b bx by bz ca r cb cc">
                <div class="gf n o">
                  <div class="ck" aria-hidden="true">
                    <button class="ct cu bg bh bi bj bk bl bm bn cv cw bq cx cy">
                      <svg width="21" height="21" viewBox="0 0 21 21">
                        <path
                          d="M4 7.33L10.03 14l.5.55.5-.55 5.96-6.6-.98-.9-5.98 6.6h1L4.98 6.45z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

Story.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Story;
