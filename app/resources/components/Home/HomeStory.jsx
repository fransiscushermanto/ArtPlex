import React from "react";
import Moment from "react-moment";
import { calculateSpeed } from "../Function/Factories";
import { Link } from "react-router-dom";
const HomeStory = ({
  image_url,
  title,
  author_name,
  total_word,
  publish_date,
  body,
  categories,
  author_username,
  story_id,
}) => {
  const handleTag = () => {
    return categories.join(", ");
  };

  return (
    <div className="story">
      <div className="col">
        <div className="tag">
          <span>{handleTag()}</span>
        </div>
        <div className="title">
          <Link
            to={`/@${author_username}/${story_id}`}
            className="no-animation"
          >
            <span>{title}</span>
          </Link>
        </div>
        <div className="description">
          <Link
            to={`/@${author_username}/${story_id}`}
            className="no-animation"
          >
            <span>{body}</span>
          </Link>
        </div>
        <div className="information-pane mt-auto">
          <div className="row">
            <div className="col">
              <div className="author-name">{author_name}</div>
              <div className="story-info">
                <Moment format="MMMM DD">{publish_date}</Moment>{" "}
                <div className="seperator">
                  <div className="gd ge r">
                    <span className="r">
                      <span className="bw b bx by bz ca r cb cc">·</span>
                    </span>
                  </div>
                </div>{" "}
                {`${calculateSpeed(Number.parseInt(total_word))} min read `}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <Link
          to={`/@${author_username}/${story_id}`}
          className="image-story no-animation"
          style={
            image_url !== "null"
              ? {
                  backgroundImage: `url(
                      "${image_url}"
                    )`,
                }
              : { backgroundColor: "gray" }
          }
        >
          {image_url !== "null" ? null : (
            <div className="width-100">No Image</div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default HomeStory;
