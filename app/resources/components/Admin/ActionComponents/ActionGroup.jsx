import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Refresh } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import axios from "axios";

import UserList from "./UserList";
import StoryList from "./StoryList";
import CommentList from "./CommentList";
import EditPane from "../EditPane";
const ActionGroup = ({ user, setStatusAction, statusAction }) => {
  let { type } = useParams();
  const [openEditPane, setOpenEditPane] = useState(false);
  const [reload, setReload] = useState(false);
  const [tempData, setTempData] = useState();
  const [listData, setListData] = useState({
    users: [],
    stories: [],
    comments: [],
    categories: [],
  });
  const [searchByType, setSearchByType] = useState({
    users: "",
    stories: "",
    comments: "",
    categories: "",
  });

  const urlPath = async (url, data) => {
    const res = await axios.post(url, data);
    return res.data;
  };

  const conditionalPassData = () => {
    switch (type) {
      case "users":
        const data = new FormData();
        data.append("user_id", tempData.user_id);
        data.append("name", tempData.name);
        data.append("level", tempData.level);
        return data;
      default:
        break;
    }
  };

  const updateData = async () => {
    const data = conditionalPassData();
    switch (type) {
      case "users":
        const status = await urlPath("/api/actions/update_user.php", data);
        console.log(status);
        if (status.success) {
          setOpenEditPane(false);
          const temp = [...listData.users];
          temp[tempData.index].name = tempData.name;
          temp[tempData.index].level = tempData.level;
          setListData({ ...listData, users: temp });
          setStatusAction({
            open: true,
            message: "Successfully Updated User",
            severity: "success",
          });
        } else {
          setOpenEditPane(false);
          setStatusAction({
            open: true,
            message: res.data.error,
            severity: "error",
          });
        }
        break;
      case "stories":
        break;
      default:
        break;
    }
  };

  const renderByType = () => {
    switch (type) {
      case "users":
        return (
          <UserList
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
            setOpenEditPane={setOpenEditPane}
            openEditPane={openEditPane}
            tempUserData={tempData}
            setTempUserData={setTempData}
            reload={reload}
            setReload={setReload}
            searchUser={searchByType.users}
            listUserData={listData.users}
            setListUserData={setListData}
          />
        );
      case "stories":
        return (
          <StoryList
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
            setOpenEditPane={setOpenEditPane}
            openEditPane={openEditPane}
            tempStoryData={tempData}
            setTempStoryData={setTempData}
            reload={reload}
            setReload={setReload}
            searchStory={searchByType.stories}
            listStoryData={listData.stories}
            setListStoryData={setListData}
          />
        );
      case "comments":
        return (
          <CommentList
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
            tempCommentData={tempData}
            setTempCommentData={setTempData}
            reload={reload}
            setReload={setReload}
            searchStory={searchByType.comments}
            listCommentData={listData.comments}
            setListCommentData={setListData}
          />
        );
      default:
        break;
    }
  };

  const searchDefaultValueByType = () => {
    switch (type) {
      case "users":
        return searchByType.users;
      case "stories":
        return searchByType.stories;
      case "comments":
        return searchByType.comments;
      case "categories":
        return searchByType.categories;
      default:
        break;
    }
  };

  const handleOnChangeSearchByType = (value) => {
    switch (type) {
      case "users":
        setSearchByType({ ...searchByType, users: value });
        break;
      case "stories":
        setSearchByType({ ...searchByType, stories: value });
        break;
      case "comments":
        setSearchByType({ ...searchByType, comments: value });
        break;
      case "categories":
        setSearchByType({ ...searchByType, categories: value });
        break;
      default:
        break;
    }
  };

  return (
    <div className="action-pane-wrapper">
      {openEditPane ? (
        <EditPane
          type={type}
          tempData={tempData}
          setCloseState={setOpenEditPane}
          setTempData={setTempData}
          updateData={updateData}
        />
      ) : null}

      <div className="header">
        <span>{type.toUpperCase()}</span>

        <div
          className="refresh-icon"
          style={{ backgroundColor: "#2196f3" }}
          onClick={() => {
            setReload(true);
            handleOnChangeSearchByType("");
          }}
        >
          <Refresh style={{ color: grey[50] }} />
          <span>Refresh</span>
        </div>

        <div className="search-bar">
          <input
            type="text"
            name="search"
            id="search"
            className="form-control"
            value={searchDefaultValueByType()}
            placeholder={`Search ${type.charAt(0).toUpperCase() +
              type.slice(1)}`}
            onChange={(e) => handleOnChangeSearchByType(e.target.value)}
          />
          <Search style={{ color: grey[900] }} />
        </div>
      </div>
      <div className="main-action-pane">{renderByType()}</div>
    </div>
  );
};

export default ActionGroup;
