import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutline, Check, Clear } from "@material-ui/icons";
import { red, green } from "@material-ui/core/colors";
import { Switch } from "@material-ui/core";

import axios from "axios";

import DeleteModals from "../../Modals/DeleteModals";

const UserList = ({
  user,
  setStatusAction,
  statusAction,
  setOpenEditPane,
  openEditPane,
  setTempUserData,
  tempUserData,
  reload,
  setReload,
  searchUser,
  listUserData,
  setListUserData,
}) => {
  const [columns] = useState([
    { name: "#" },
    { name: "Name" },
    { name: "Email" },
    { name: "Username" },
    { name: "Password" },
    { name: "Verified" },
    { name: "Status" },
    {
      name: "Level",
    },
    { name: "Remember Token" },
    { name: "" },
  ]);

  const [hasMore, setHasMore] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const renderTableColumn = () => {
    return columns.map((column) => {
      return <th key={column.name}>{column.name}</th>;
    });
  };

  const handleStatusChange = async (rowData) => {
    const temp = [...listUserData];
    const index = temp.indexOf(rowData);
    const data = new FormData();
    data.append("user_id", rowData.user_id);
    data.append("status", !temp[index].status);
    const res = await axios.post("/api/actions/update_user_status.php", data);
    if (res.data.success) {
      temp[index].status = !temp[index].status;
      setListUserData({ users: temp });
      setStatusAction({
        open: true,
        message: "Status Updated",
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

  const renderTableRow = () => {
    return listUserData.map((data, index) => {
      return (
        <tr key={index}>
          <td>{data.user_id}</td>
          <td>{data.name}</td>
          <td>{data.email}</td>
          <td>{data.username}</td>
          <td>{data.password}</td>
          <td>
            {data.verified ? (
              <Check style={{ color: green[500] }} />
            ) : (
              <Clear style={{ color: red[500] }} />
            )}
          </td>
          <td>
            <Switch
              disabled={user.id === data.user_id ? true : false}
              checked={data.status}
              onChange={() => handleStatusChange(data)}
              name="status"
              color="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </td>
          <td>{data.level}</td>
          <td>{data.remember_token}</td>
          <td>
            <span
              className="btn-action mr-2"
              title="Edit"
              onClick={() => {
                setOpenEditPane(!openEditPane);
                data["index"] = index;
                setTempUserData(data);
              }}
            >
              <EditOutlined />
            </span>
            {user.id === data.user_id ? null : (
              <span
                className="btn-action"
                onClick={() => {
                  setOpenDeleteModal(true);
                  setTempUserData(data);
                }}
                title="Delete"
              >
                <DeleteOutline />
              </span>
            )}
          </td>
        </tr>
      );
    });
  };

  const deleteUser = async (user_id) => {
    const data = new FormData();
    data.append("user_id", user_id);
    const res = await axios.post("/api/actions/delete_user.php", data);
    if (res.data.success) {
      setListUserData({
        users: listUserData.filter((data) => data.user_id !== user_id),
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

  async function handleScroll() {
    const ele = document.getElementById("tabular-scroll");
    if (ele.offsetHeight + Math.floor(ele.scrollTop) !== ele.scrollHeight) {
      return;
    }

    if (listUserData.length >= 10 && listUserData) {
      const currentpage = Math.round(listUserData.length / 10);
      if (hasMore) {
        const data = new FormData();
        if (searchUser !== "") {
          data.append("name", searchUser);
        }
        data.append("page", currentpage);

        const res = await axios.post("/api/actions/get_list_user.php", data);
        if (res.data.success) {
          if (res.data.users.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          let tempUsers = [...listUserData];
          res.data.users.map((user) => {
            tempUsers.push(user);
          });
          setListUserData({ users: tempUsers });
        }
      }
    }
  }

  useEffect(() => {
    const ele = document.getElementById("tabular-scroll");
    ele.addEventListener("scroll", handleScroll);
    return () => ele.removeEventListener("scroll", handleScroll);
  }, [listUserData, hasMore]);

  useEffect(() => {
    axios
      .get("/api/actions/get_list_user.php")
      .then((res) => setListUserData({ users: res.data.users }))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (reload) {
      setHasMore(true);
      axios
        .get("/api/actions/get_list_user.php")
        .then((res) => {
          // console.log(res.data);
          setListUserData({ users: res.data.users });
          setReload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reload]);

  useEffect(() => {
    if (searchUser !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("name", searchUser);
      axios
        .post("/api/actions/get_list_user.php", data)
        .then((res) => setListUserData({ users: res.data.users }));
    } else {
      setReload(true);
    }
  }, [searchUser]);

  return openDeleteModal ? (
    <DeleteModals
      text={`Are you sure to remove ${tempUserData.name}? Deleted data can't be restored anymore.  `}
      setModal={setOpenDeleteModal}
      param={tempUserData.user_id}
      onClick={deleteUser}
    />
  ) : (
    <div className="inner-action-pane user-pane" id="tabular-scroll">
      <table className="table">
        <thead>
          <tr>{renderTableColumn()}</tr>
        </thead>

        <tbody>{listUserData !== undefined ? renderTableRow() : null}</tbody>
      </table>
    </div>
  );
};

export default UserList;
