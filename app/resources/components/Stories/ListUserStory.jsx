import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import UserStory from "./UserStory";
import DeleteModals from "../Modals/DeleteModals";
const ListStory = ({ user, setModal, modal, setStoryId, storyId }) => {
  let { type } = useParams();
  const [draftStories, setDraftStories] = useState([]);
  const [publishStories, setPublishStories] = useState([]);
  useEffect(() => {
    const getUserStory = async () => {
      const data = new FormData();
      data.append("type", "all");
      data.append("user_id", user.id);
      const res = await axios.post("/api/actions/get_story.php", data);
      if (res.data.success) {
        setDraftStories(res.data.draftStories);
        setPublishStories(res.data.publishStories);
      }
    };
    getUserStory();
  }, []);

  const deleteStory = async (story_id) => {
    let newStoryArr;
    if (type === "draft") {
      newStoryArr = draftStories.filter(
        (story) => !story.story_id.includes(story_id)
      );
    } else if (type === "publish") {
      newStoryArr = publishStories.filter(
        (story) => !story.story_id.includes(story_id)
      );
    }
    const data = new FormData();
    data.append("story_id", story_id);
    data.append("user_id", user.id);
    const res = await axios.post("/api/actions/delete_story.php", data);
    if (res.data.success) {
      if (type === "draft") {
        setDraftStories(newStoryArr);
      } else if (type === "publish") {
        setPublishStories(newStoryArr);
      }
    }
  };

  const renderStories = () => {
    return type === "draft"
      ? draftStories.map((story, index) => {
          return (
            <UserStory
              key={index}
              title={story.title}
              body={story.body}
              publish_date={story.publish_date}
              story_id={story.story_id}
              total_word={story.total_word}
              last_update={story.last_update}
              status={story.status}
              setModal={setModal}
              setStoryId={setStoryId}
              author={user.username}
            />
          );
        })
      : publishStories.map((story, index) => {
          return (
            <UserStory
              key={index}
              title={story.title}
              body={story.body}
              publish_date={story.publish_date}
              story_id={story.story_id}
              total_word={story.total_word}
              last_update={story.last_update}
              status={story.status}
              setModal={setModal}
              setStoryId={setStoryId}
              author={user.username}
            />
          );
        });
  };

  return (
    <>
      {modal ? (
        <DeleteModals
          setModal={setModal}
          onClick={deleteStory}
          param={storyId}
        />
      ) : null}
      <div className="row">
        <div className="data-table">
          <ul className="list-data-table">
            <li className={type === "draft" ? "active" : ""}>
              <span>
                <Link to="draft">
                  Drafts {draftStories.length > 0 ? draftStories.length : null}
                </Link>
              </span>
            </li>
            <li className={type === "publish" ? "active" : ""}>
              <span>
                <Link to="publish">
                  Published{" "}
                  {publishStories.length > 0 ? publishStories.length : null}
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          {type === "draft" ? (
            draftStories.length > 0 ? (
              renderStories()
            ) : (
              <NoStoriesMessage type={type} />
            )
          ) : type === "publish" ? (
            publishStories.length > 0 ? (
              renderStories()
            ) : (
              <NoStoriesMessage type={type} />
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

const NoStoriesMessage = ({ type }) => {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "17px",
        color: "black",
        display: "flex",
        flexDirection: "column",
        margin: "100px 0px",
      }}
    >
      {type === "draft" ? (
        <>
          <span>You have no stories.</span>
          <span className="mt-5">
            Go Write some stories. We are waiting for you.
          </span>
        </>
      ) : type === "publish" ? (
        <>
          <span>You haven't published any public stories yet.</span>
        </>
      ) : null}
    </div>
  );
};

export default ListStory;
