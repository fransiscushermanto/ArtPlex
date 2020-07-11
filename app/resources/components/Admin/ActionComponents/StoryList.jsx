import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AccessTime,
  DeleteOutline,
  WarningOutlined,
  Check,
  Clear,
} from "@material-ui/icons";
import { red, grey, green } from "@material-ui/core/colors";
import HomeStory from "../../Home/HomeStory";
import Moment from "react-moment";

const StoryList = ({
  setStatusAction,
  statusAction,
  setTempStoryData,
  tempStoryData,
  reload,
  setReload,
  searchStory,
  listStoryData,
  setListStoryData,
}) => {
  const [hasMore, setHasMore] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [radioPage, setRadioPage] = useState({ checked: "all" });
  const [inputs, setInputs] = useState([
    {
      type: "radio",
      name: "page",
      className: "form-control",
      label: "All",
      value: "all",
      onChange: function(e) {
        setRadioPage({ checked: e.target.value });
      },
    },
    {
      type: "radio",
      name: "page",
      className: "form-control",
      label: "Published",
      value: "publish",
      onChange: function(e) {
        setRadioPage({ checked: e.target.value });
      },
    },
    {
      type: "radio",
      name: "page",
      className: "form-control",
      label: "Not-Published",
      value: "unpublish",
      onChange: function(e) {
        setRadioPage({ checked: e.target.value });
      },
    },
  ]);

  useEffect(() => {
    const data = new FormData();
    data.append("type", radioPage.checked);
    axios
      .post("/api/actions/admin_get_list_story.php", data)
      .then((res) => {
        document.getElementById("tabular-scroll").scrollTop = 0;
        setListStoryData({ stories: res.data.stories });
        setHasMore(true);
      })
      .catch((err) => console.log(err));
  }, [radioPage]);

  useEffect(() => {
    if (reload) {
      const data = new FormData();
      data.append("type", radioPage.checked);
      axios
        .post("/api/actions/admin_get_list_story.php", data)
        .then((res) => {
          setListStoryData({ stories: res.data.stories });
          setReload(false);
        })
        .catch((err) => console.log(err));
    }
  }, [reload]);

  async function handleScroll() {
    const ele = document.getElementById("tabular-scroll");
    if (ele.offsetHeight + Math.ceil(ele.scrollTop) !== ele.scrollHeight) {
      return;
    }
    const limit = 4;
    if (listStoryData.length >= limit && listStoryData) {
      const currentpage = Math.round(listStoryData.length / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchStory !== "") {
          data.append("title", searchStory);
        }
        data.append("type", radioPage.checked);
        data.append("page", currentpage);

        const res = await axios.post(
          "/api/actions/admin_get_list_story.php",
          data
        );
        if (res.data.success) {
          if (res.data.stories.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          let tempStories = [...listStoryData];
          res.data.stories.map((story) => {
            tempStories.push(story);
          });
          setListStoryData({ stories: tempStories });
        }
      }
    }
  }

  const deleteStory = async (story_id) => {
    const data = new FormData();
    data.append("story_id", story_id);
    const res = await axios.post("/api/actions/delete_story.php", data);
    if (res.data.success) {
      setListStoryData({
        stories: listStoryData.filter((data) => data.story_id !== story_id),
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
    const ele = document.getElementById("tabular-scroll");
    ele.addEventListener("scroll", handleScroll);
    return () => ele.removeEventListener("scroll", handleScroll);
  }, [listStoryData, hasMore]);

  useEffect(() => {
    if (searchStory !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("type", radioPage.checked);
      data.append("title", searchStory);
      axios.post("/api/actions/admin_get_list_story.php", data).then((res) => {
        setListStoryData({ stories: res.data.stories });
      });
    } else {
      setReload(true);
    }
  }, [searchStory]);
  return (
    <div className="inner-action-pane story-pane" id="tabular-scroll">
      <header className="d-flex flex-row align-items-center width-100">
        <span className="mr-3">Show: </span>
        {inputs.map((input, index) => {
          return (
            <div key={index} className="form-group mr-3">
              <input
                type={input.type}
                name={input.name}
                value={input.value}
                checked={radioPage.checked === input.value}
                onChange={(e) => input.onChange(e)}
                className="mr-1"
              />
              <label>{input.label}</label>
            </div>
          );
        })}
      </header>
      <div className="story-admin-wrapper list-story">
        {listStoryData
          ? listStoryData.map((story, index) => {
              return (
                <div
                  key={index}
                  className={
                    story.status === "on"
                      ? "d-flex flex-column inner-story-admin-wrapper"
                      : "d-flex flex-column inner-story-admin-wrapper disable"
                  }
                >
                  <HomeStory
                    author_name={story.author.name}
                    body={story.body}
                    title={story.title}
                    total_word={story.total_word}
                    publish_date={
                      story.status === "off"
                        ? story.last_update
                        : story.publish_date
                    }
                    image_url={story.image_preview}
                    categories={story.categories}
                    story_id={story.story_id}
                    author_username={story.author.username}
                  />
                  <div className="action-btn">
                    <span className="ml-1 d-flex align-items-center">
                      Published :{" "}
                      {story.status === "on" ? (
                        <Check style={{ color: green[500] }} />
                      ) : (
                        <Clear style={{ color: red[500] }} />
                      )}
                    </span>
                    {"|"}
                    <span
                      className="btn-action"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setTempStoryData(story);
                      }}
                      title="Delete"
                    >
                      <DeleteOutline />
                    </span>
                    <span className="ml-auto">
                      <AccessTime className="mr-1" /> Last updated about{" "}
                      <Moment fromNow>{story.last_update}</Moment>
                    </span>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      {openDeleteModal ? (
        <div className="confirmation" style={{ backgroundColor: red[800] }}>
          <WarningOutlined style={{ color: grey[50], fontSize: "30px" }} />
          <span>
            Are you sure wish to delete the story "
            <div>
              <span>{tempStoryData.title}</span>
            </div>
            " by {tempStoryData.author.name} ?
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
                deleteStory(tempStoryData.story_id);
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

export default StoryList;
