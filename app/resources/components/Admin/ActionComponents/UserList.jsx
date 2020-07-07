import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutline } from "@material-ui/icons";

import axios from "axios";

import DeleteModals from "../../Modals/DeleteModals";
const UserList = ({ user, setStatusAction, statusAction }) => {
  const [state, setState] = useState({
    columns: [
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
    ],
    datas: [],
  });

  const [hasMore, setHasMore] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [tempUserData, setTempUserData] = useState();

  const renderTableColumn = () => {
    return state.columns.map((column) => {
      return <th key={column.name}>{column.name}</th>;
    });
  };

  const renderTableRow = () => {
    return state.datas.map((data, index) => {
      return (
        <tr key={index}>
          <td>{data.user_id}</td>
          <td>{data.name}</td>
          <td>{data.email}</td>
          <td>{data.username}</td>
          <td>{data.password}</td>
          <td>{data.verified}</td>
          <td>{data.status}</td>
          <td>{data.level}</td>
          <td>{data.remember_token}</td>
          <td>
            <span className="btn-action mr-2" title="Edit">
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
      setState({
        ...state,
        datas: state.datas.filter((data) => data.user_id !== user_id),
      });
      setStatusAction({
        open: true,
        message: "Delete Success",
        severity: "sucess",
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

    if (state.datas.length >= 10 && state.datas) {
      const currentpage = Math.round(state.datas.length / 10);
      if (hasMore) {
        const data = new FormData();
        // data.append("name", name);
        data.append("page", currentpage);

        const res = await axios.post("/api/actions/get_list_user.php", data);
        if (res.data.success) {
          if (res.data.users.length < 2) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          let tempUsers = [...state.datas];
          res.data.users.map((user) => {
            tempUsers.push(user);
          });
          setState({ ...state, datas: tempUsers });
        }
      }
    }
  }

  useEffect(() => {
    const ele = document.getElementById("tabular-scroll");
    ele.addEventListener("scroll", handleScroll);
    return () => ele.removeEventListener("scroll", handleScroll);
  }, [state.datas, hasMore]);

  useEffect(() => {
    axios
      .get("/api/actions/get_list_user.php")
      .then((res) => setState({ ...state, datas: res.data.users }))
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

        <tbody>{renderTableRow()}</tbody>
      </table>
    </div>
  );
};

export default UserList;
