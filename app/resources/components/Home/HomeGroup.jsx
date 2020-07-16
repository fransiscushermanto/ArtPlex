import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";

import HomeStory from "./HomeStory";
import { detectOnBlur } from "../Function/Factories";
const loadTimeout = 300;

const HomeGroup = ({ user }) => {
  const searchRef = useRef(null);

  const { register, handleSubmit, watch } = useForm();

  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([
    { category_id: "none", tag: "-" },
  ]);

  const startSearch = async (formData) => {
    setLoading(true);
    setHasMore(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category_id", formData.category);
    const res = await axios.post("/api/actions/get_list_story.php", data);
    if (res.data.success) {
      setStories(res.data.stories);
      setTimeout(() => {
        setLoading(false);
      }, loadTimeout);
    } else {
      setStories(res.data.stories);
      setTimeout(() => {
        setLoading(false);
      }, loadTimeout);
    }
  };

  async function handleScroll() {
    if (
      window.innerHeight + Math.floor(document.documentElement.scrollTop) !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    const limit = 20;
    if (stories.length >= limit && stories) {
      const currentpage = Math.round(stories.length / limit);
      if (hasMore) {
        setLoading(true);
        const data = new FormData();
        data.append("title", watch("title"));
        data.append("category_id", watch("category"));
        data.append("page", currentpage);

        const res = await axios.post("/api/actions/get_list_story.php", data);
        // console.log(res.data);
        if (res.data.success) {
          setLoading(false);
          if (res.data.stories.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          let tempStories = [...stories];
          res.data.stories.map((story) => {
            tempStories.push(story);
          });
          setStories(tempStories);
        }
      }
    }
  }

  useEffect(() => {
    axios
      .get("/api/actions/get_all_tag.php")
      .then((res) => {
        let arrCategories = [...categories];
        // console.log(res.data);
        res.data.categories.map((category) => {
          arrCategories.push(category);
        });
        setCategories(arrCategories);
      })
      .catch((err) => console.log(err));
    setLoading(true);
    axios
      .get("/api/actions/get_list_story.php")
      .then((res) => {
        setStories(res.data.stories);
        setTimeout(() => {
          setLoading(false);
        }, loadTimeout);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    detectOnBlur(searchRef, openSearchBar, setOpenSearchBar);
  }, [searchRef, openSearchBar]);

  useEffect(() => {
    if (openSearchBar) {
      document.getElementById("search-bar").focus();
    }
  }, [openSearchBar]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, stories, document.documentElement.scrollTop, loading]);
  return user ? (
    <div className="home-wrapper">
      <div className="container">
        <div className="header width-100">
          <div className="search-bar" ref={searchRef}>
            <input
              ref={register}
              type="text"
              name="title"
              id="search-bar"
              maxLength="500"
              onChange={handleSubmit(startSearch)}
              placeholder="Search title"
              className={openSearchBar ? "form-control show " : "form-control"}
            />
            <div
              className="search-icon mr-2"
              onClick={() => setOpenSearchBar(!openSearchBar)}
            >
              <span
                className="svgIcon svgIcon--search svgIcon--25px u-baseColor--iconLight"
                title="Toggle Search"
              >
                <svg className="svgIcon-use" width="25" height="25">
                  <path d="M20.067 18.933l-4.157-4.157a6 6 0 1 0-.884.884l4.157 4.157a.624.624 0 1 0 .884-.884zM6.5 11c0-2.62 2.13-4.75 4.75-4.75S16 8.38 16 11s-2.13 4.75-4.75 4.75S6.5 13.62 6.5 11z"></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="ml-auto categories-selection">
            <span className="mr-3">Filter by Tag : </span>
            <select
              ref={register}
              className="form-control"
              name="category"
              id=""
              onChange={handleSubmit(startSearch)}
            >
              {categories.map((category, index) => {
                return (
                  <option key={index} value={category.category_id}>
                    {category.tag}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {stories !== null ? (
          loading && stories === null ? (
            <div
              style={{
                width: "100wh",
                height: "loadTimeoutpx",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size="40px" color="inherit" />
            </div>
          ) : (
            <div
              className="list-story-wrapper"
              style={{ marginBottom: "70px" }}
            >
              <div className="list-story">
                {stories ? (
                  stories.length > 0 ? (
                    stories.map((story, index) => {
                      return (
                        <HomeStory
                          key={index}
                          author_name={story.author.name}
                          body={story.body}
                          title={story.title}
                          total_word={story.total_word}
                          publish_date={story.publish_date}
                          image_url={story.image_preview}
                          categories={story.categories}
                          story_id={story.story_id}
                          author_username={story.author.username}
                        />
                      );
                    })
                  ) : (
                    <div style={{ width: "100%" }}>
                      <h1>
                        <b>No items found.</b>
                      </h1>
                    </div>
                  )
                ) : (
                  <div style={{ width: "100%" }}>
                    <h1>
                      <b>No items found.</b>
                    </h1>
                  </div>
                )}
              </div>
              {loading ? (
                <div
                  className="loader-wrapper"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size="40px" color="inherit" />
                </div>
              ) : null}
            </div>
          )
        ) : null}
      </div>
    </div>
  ) : null;
};

export default HomeGroup;
