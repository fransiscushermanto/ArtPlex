import React, { useEffect, useState, useRef } from "react";
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
  searchStories,
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
  const storyLength = useRef(0);
  const accessTime = useRef("");
  const deletedNumber = useRef(0);

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

    const data = new FormData();
    data.append("type", radioPage.checked);
    axios
      .post("/api/actions/admin_get_list_story.php", data)
      .then((res) => {
        document.getElementById("tabular-scroll").scrollTop = 0;
        storyLength.current = res.data.stories.length;
        setListStoryData({ stories: res.data.stories });
        setHasMore(true);
      })
      .catch((err) => console.log(err));
  }, [radioPage]);

  useEffect(() => {
    if (reload) {
      document.getElementById("tabular-scroll").scrollTop = 0;
      const data = new FormData();
      data.append("type", radioPage.checked);
      axios
        .post("/api/actions/admin_get_list_story.php", data)
        .then((res) => {
          storyLength.current = res.data.stories.length;
          setHasMore(true);
          setReload(false);
          setListStoryData({ stories: res.data.stories });
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
    if (storyLength.current >= limit && listStoryData) {
      const currentpage = Math.round(storyLength.current / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchStories !== "") {
          data.append("title", searchStories);
        }
        data.append("type", radioPage.checked);
        data.append("page", currentpage);
        data.append("access_time", accessTime.current);
        data.append("deleted_number", deletedNumber.current);
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
          storyLength.current += res.data.stories.legnth;
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
      setHasMore(true);
      setListStoryData({
        stories: listStoryData.filter((data) => data.story_id !== story_id),
      });
      deletedNumber.current++;
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
    if (searchStories !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("type", radioPage.checked);
      data.append("title", searchStories);
      axios.post("/api/actions/admin_get_list_story.php", data).then((res) => {
        storyLength.current = res.data.stories.length;
        setListStoryData({ stories: res.data.stories });
      });
    } else {
      setReload(true);
    }
  }, [searchStories]);
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
        {listStoryData ? (
          listStoryData.length > 0 ? (
            listStoryData.map((story, index) => {
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
          ) : (
            <div>
              <h1 className="font-weight-bold">No Stories Found</h1>
            </div>
          )
        ) : null}
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
