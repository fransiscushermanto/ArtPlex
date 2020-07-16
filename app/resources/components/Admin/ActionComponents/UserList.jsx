import React, { useState, useEffect, useRef } from "react";
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
  searchUsers,
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
  const accessTime = useRef("");
  const userLength = useRef(0);
  const deletedNumber = useRef(0);
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
      deletedNumber.current++;
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
    const limit = 10;
    if (userLength.current >= limit && listUserData) {
      const currentpage = Math.round(userLength.current / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchUsers !== "") {
          data.append("name", searchUsers);
        }
        data.append("page", currentpage);
        data.append("access_time", accessTime.current);
        data.append("deleted_number", deletedNumber.current);
        const res = await axios.post("/api/actions/get_list_user.php", data);
        if (res.data.success) {
          if (res.data.users.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          userLength.current += res.data.users.length;
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
    axios
      .get("/api/actions/get_list_user.php")
      .then((res) => {
        userLength.current = res.data.users.length;
        setListUserData({ users: res.data.users });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (reload) {
      document.getElementById("tabular-scroll").scrollTop = 0;
      axios
        .get("/api/actions/get_list_user.php")
        .then((res) => {
          // console.log(res.data);
          setHasMore(true);
          userLength.current = res.data.users.length;
          setListUserData({ users: res.data.users });
          setReload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reload]);

  useEffect(() => {
    if (searchUsers !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("name", searchUsers);
      axios.post("/api/actions/get_list_user.php", data).then((res) => {
        userLength.current = res.data.users.length;
        setListUserData({ users: res.data.users });
      });
    } else {
      setReload(true);
    }
  }, [searchUsers]);

  return openDeleteModal ? (
    <DeleteModals
      text={`Are you sure to remove ${tempUserData.name}? Deleted data can't be restored anymore.  `}
      setModal={setOpenDeleteModal}
      param={tempUserData.user_id}
      onClick={deleteUser}
    />
  ) : (
    <div
      className="inner-action-pane user-pane flex-column justify-content-start"
      id="tabular-scroll"
    >
      <table className="table">
        <thead>
          <tr>{renderTableColumn()}</tr>
        </thead>

        <tbody>{listUserData !== undefined ? renderTableRow() : null}</tbody>
      </table>
      {listUserData ? (
        listUserData.length > 0 ? null : (
          <div className="width-100" style={{ textAlign: "center" }}>
            <h1 className="font-weight-bold">No Users Found</h1>
          </div>
        )
      ) : (
        <div className="width-100" style={{ textAlign: "center" }}>
          <h1 className="font-weight-bold">No Users Found</h1>
        </div>
      )}
    </div>
  );
};

export default UserList;
