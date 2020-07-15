import React, { useEffect, useRef, useState } from "react";
import { Add } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import axios from "axios";

import { CategoryCard, AddCategoryCard } from "../../Function/Factories";
const CategoryList = ({
  user,
  setStatusAction,
  statusAction,
  setTempCategoryData,
  tempCategoryData,
  reload,
  setReload,
  searchCategories,
  listCategoryData,
  setListCategoryData,
}) => {
  const [hasMore, setHasMore] = useState(true);
  const [openDetailPane, setOpenDetailPane] = useState(false);
  const categoryLength = useRef(0);
  const deletedNumber = useRef(0);
  const arrayOfCategoryIdAdded = useRef([]);

  async function handleScroll() {
    const ele = document.getElementById("tabular-scroll");

    if (ele.offsetHeight + Math.ceil(ele.scrollTop) !== ele.scrollHeight) {
      return;
    }
    const limit = 12;
    if (categoryLength.current >= limit && listCategoryData) {
      const currentpage = Math.round(categoryLength.current / limit);
      if (hasMore) {
        const data = new FormData();
        if (searchCategories !== "") {
          data.append("title", searchCategories);
        }
        data.append(
          "arr_added_category_id",
          JSON.stringify(arrayOfCategoryIdAdded.current)
        );
        data.append("page", currentpage);
        data.append("deleted_number", deletedNumber.current);
        const res = await axios.post("/api/actions/get_list_tag.php", data);
        if (res.data.success) {
          console.log(res.data);
          if (res.data.categories.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          categoryLength.current += res.data.categories.legnth;
          let tempCategories = [
            ...listCategoryData.filter(
              (category) => category.category_id !== null
            ),
          ];
          let tempNewCategories = [
            ...listCategoryData.filter(
              (category) => category.category_id === null
            ),
          ];
          res.data.categories.map((category) => {
            tempCategories.push(category);
          });
          tempNewCategories.map((newCategory) => {
            tempCategories.push(newCategory);
          });
          // console.log(tempCategories);
          setListCategoryData({ categories: tempCategories });
        }
      }
    }
  }

  const openEditPane = (target) => {
    const temp = [...listCategoryData];
    const index = temp.indexOf(target);
    temp[index].edit = !temp[index].edit;
    setListCategoryData({ categories: temp });
  };

  const saveEdit = async (target, value) => {
    const temp = [...listCategoryData];
    const index = temp.indexOf(target);
    const data = new FormData();
    data.append("category_id", target.category_id);
    data.append("tag", value);
    const res = await axios.post("/api/actions/update_tag.php", data);
    if (res.data.success) {
      temp[index].tag = value;
      setListCategoryData({ categories: temp });
      setStatusAction({
        open: true,
        message: "Successfully Edit Category",
        severity: "success",
      });
      return true;
    } else {
      setStatusAction({
        open: true,
        message: res.data.error,
        severity: "error",
      });
      return true;
    }
  };

  const openDeletePane = (target) => {
    const temp = [...listCategoryData];
    const index = temp.indexOf(target);
    temp[index].delete = !temp[index].delete;
    setListCategoryData({ categories: temp });
  };

  const saveDelete = async (target) => {
    const temp = [
      ...listCategoryData.filter(
        (category) => category.category_id !== target.category_id
      ),
    ];
    temp.map((category) => {
      category.total_story -= 1;
    });
    const data = new FormData();
    data.append("category_id", target.category_id);
    const res = await axios.post("/api/actions/delete_tag.php", data);
    if (res.data.success) {
      console.log(temp);
      setListCategoryData({
        categories: temp,
      });
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

    return true;
  };

  const onAddCard = () => {
    document.getElementById("category-list-wrapper").style.marginBottom =
      "200px";
    setListCategoryData({
      categories: [
        ...listCategoryData,
        {
          category_id: null,
          tag: "",
          delete: false,
          edit: false,
          total_story: 0,
          total_used_story: 0,
          add: true,
        },
      ],
    });
  };

  const onCancelAddCard = (target) => {
    document.getElementById("category-list-wrapper").style.marginBottom = "0px";
    const temp = [...listCategoryData];
    const index = temp.indexOf(target);
    temp.splice(index, 1);
    setListCategoryData({ categories: temp });
  };

  const tempSaveNewCard = (target, value) => {
    const temp = [...listCategoryData];
    const index = temp.indexOf(target);
    temp[index].tag = value;
    setListCategoryData({ categories: temp });
  };

  const saveNewCard = async (formData) => {
    const temp = [...listCategoryData];
    const index = temp.indexOf(tempCategoryData);
    const data = new FormData();
    data.append("tag", formData.tag);
    const res = await axios.post("/api/actions/create_tag.php", data);
    if (res.data.success) {
      arrayOfCategoryIdAdded.current.push(res.data.categories.category_id);
      temp[index] = res.data.categories;
      setListCategoryData({ categories: temp });
      setStatusAction({
        open: true,
        message: "Success Added New Category",
        severity: "success",
      });
      // setHasMore(false);
    } else {
      setStatusAction({
        open: true,
        message: res.data.error,
        severity: "error",
      });
      // setHasMore(false);
    }
  };

  useEffect(() => {
    axios
      .get("/api/actions/get_list_tag.php")
      .then((res) => {
        categoryLength.current = res.data.categories.length;
        setListCategoryData({ categories: res.data.categories });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (reload) {
      document.getElementById("tabular-scroll").scrollTop = 0;
      document.getElementById("category-list-wrapper").style.marginBottom =
        "0px";
      axios
        .get("/api/actions/get_list_tag.php")
        .then((res) => {
          categoryLength.current = res.data.categories.length;
          arrayOfCategoryIdAdded.current = [];
          setListCategoryData({ categories: res.data.categories });
          setReload(false);
          setHasMore(true);
        })
        .catch((err) => console.log(err));
    }
  }, [reload]);

  useEffect(() => {
    const ele = document.getElementById("tabular-scroll");
    ele.addEventListener("scroll", handleScroll);
    return () => ele.removeEventListener("scroll", handleScroll);
  }, [listCategoryData, hasMore]);

  useEffect(() => {
    if (searchCategories !== "") {
      setHasMore(true);
      const data = new FormData();
      data.append("tag", searchCategories);
      axios.post("/api/actions/get_list_tag.php", data).then((res) => {
        categoryLength.current = res.data.categories.length;
        setListCategoryData({ categories: res.data.categories });
      });
    } else {
      setReload(true);
    }
  }, [searchCategories]);

  return (
    <>
      <div className="detail-categories-pane"></div>
      <div className="inner-action-pane category-pane" id="tabular-scroll">
        <div className="floating-btn" onClick={() => onAddCard()}>
          <Add style={{ color: grey[50] }} />
          <span>Add Tag</span>
        </div>
        <div className="category-list width-100">
          <div className="category-list-wrapper" id="category-list-wrapper">
            {listCategoryData
              ? listCategoryData.length > 0
                ? listCategoryData.map((category, index) => {
                    return (
                      // console.log(category),
                      <CategoryCard
                        key={index}
                        tag={category.tag}
                        totalStory={category.total_story}
                        totalUsedStory={category.total_used_story}
                        category={category}
                        editState={category.edit}
                        deleteState={category.delete}
                        addState={category.add}
                        openEditPane={openEditPane}
                        openDeletePane={openDeletePane}
                        onCancelAddCard={onCancelAddCard}
                        tempCategoryData={tempCategoryData}
                        tempSaveNewCard={tempSaveNewCard}
                        setTempCategoryData={setTempCategoryData}
                        saveEdit={saveEdit}
                        saveDelete={saveDelete}
                        saveNewCard={saveNewCard}
                        searchCategories={searchCategories}
                      />
                    );
                  })
                : null
              : null}
            <AddCategoryCard onAddCard={onAddCard} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
