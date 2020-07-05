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
        <div className="tag">{handleTag()}</div>
        <div className="title">
          <Link
            to={`/@${author_username}/${story_id}`}
            className="no-animation"
          >
            {title}
          </Link>
        </div>
        <div className="description">
          <Link
            to={`/@${author_username}/${story_id}`}
            className="no-animation"
          >
            {body}
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
          style={{
            backgroundImage: `url(
                      "${image_url}"
                    )`,
          }}
        ></Link>
      </div>
    </div>
  );
};

export default HomeStory;
