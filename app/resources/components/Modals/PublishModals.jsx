import React, { useState } from "react";
import { useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";

import CustomizeHook from "../Function/CustomizeHook";

const theme = createMuiTheme({
  typography: {
    fontFamily: `medium-content-sans-serif-font, "Lucida Grande",
            "Lucida Sans Unicode", "Lucida Sans", Geneva, Arial, sans-serif`,
    fontSize: 12,
  },
});

const PublishModals = ({
  setModal,
  displayImage,
  titleParams,
  bodyParams,
  story_id,
  user_id,
  status,
  loaded_categories,
  sendEmailVerification,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [listTag, setListTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [errors, setErrors] = useState(null);

  const history = useHistory();

  useEffect(() => {
    setTitle(titleParams);
    setBody(status === "on" ? bodyParams : "");
    console.log(typeof body, titleParams, bodyParams);
  }, [titleParams, bodyParams]);

  useEffect(() => {
    const searchCategory = async () => {
      const data = new FormData();
      data.append("tag", searchTag);
      const res = await axios.post("/api/actions/get_tag.php", data);
      setListTag(res.data);
    };
    searchCategory();
  }, [searchTag]);

  const Publish = async () => {
    const data = new FormData();
    data.append("categories", JSON.stringify(selectedTag));
    data.append("body", body);
    data.append("title", title);
    data.append("story_id", story_id);
    data.append("image_preview", displayImage);
    data.append("user_id", user_id);
    data.append("status", status);
    const res = await axios.post("/api/actions/publish_story.php", data);
    console.log(res.data.error);
    if (res.data.success) {
      history.push("/story/publish");
    } else {
      setErrors(res.data.error);
    }
  };

  return (
    <div className="modals-wrapper publish-wrapper">
      <div className="content-modals publish-content">
        <div className="row">
          <div className="col">
            <p className="ui-title">
              <b>Story Preview</b>
            </p>
            <div className="image-previewer mb-3">
              <div className="image-wrapper">
                {displayImage ? (
                  <img src={displayImage} className="image-preview" alt="" />
                ) : (
                  <span>
                    Include a high-quality image in your story to make it more
                    inviting to readers.
                  </span>
                )}
              </div>
            </div>
            <div className="title-body-previewer mb-3">
              <div className="title-preview mb-3">
                <input
                  type="text"
                  name="title"
                  className="previewer"
                  placeholder="Write a preview Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="body-preview">
                <input
                  type="text"
                  name="body"
                  className="previewer"
                  value={body}
                  placeholder="Write a preview subtitle..."
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
            <div className="notes">
              <p>
                <b>Note: </b> Changes here will affect how your story appears in
                public places - not the story itself.
              </p>
            </div>
          </div>
          <div className="col">
            <div className="tags-previewer">
              <p className="mb-3">
                Add or Change tags (up to 5) so readers know what your story is
                about
              </p>
              <ThemeProvider theme={theme}>
                {selectedTag && (
                  <CustomizeHook
                    listTag={listTag}
                    setSearchTag={setSearchTag}
                    setSelectedTag={setSelectedTag}
                    searchTag={searchTag}
                    selectedTag={selectedTag}
                    defaultValue={loaded_categories}
                  />
                )}
              </ThemeProvider>
            </div>
            <div className="btn-action">
              <button onClick={Publish} className="btn btn-publish">
                <span>
                  {status === "on" ? "Save and Update Publish" : "Publish Now"}
                </span>
              </button>
            </div>
            {errors ? (
              <div className="error-message mt-5">
                <p className="bg-danger" style={{ textAlign: "center" }}>
                  {errors.email ? (
                    <span style={{ whiteSpace: "nowrap" }}>
                      {errors.email}
                      <span
                        className="send-message"
                        onClick={() => {
                          setModal(false);
                          sendEmailVerification();
                        }}
                      >
                        {" "}
                        here.
                      </span>
                    </span>
                  ) : (
                    errors.message
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="r s ib ic id ie if ig ih close-button">
        <div className="ii r s v inner-close-button">
          <span className="bw b bx by bz ca r cb cc">
            <button
              className="ct cu bg bh bi bj bk bl bm bn cv cw bq cx cy"
              data-testid="close-button"
              onClick={() => setModal(false)}
            >
              <svg className="x-29px_svg__svgIcon-use" width="29" height="29">
                <path
                  d="M20.13 8.11l-5.61 5.61-5.6-5.61-.81.8 5.61 5.61-5.61 5.61.8.8 5.61-5.6 5.61 5.6.8-.8-5.6-5.6 5.6-5.62"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PublishModals;
