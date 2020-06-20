import React from "react";

import { formatSlashDate } from "../../Function/Factories";
const ArticleComponent = ({ article }) => {
  const { title, description, created_at, story_type } = article;
  return (
    <div className="case">
      <div className="row">
        <div className="col-md-6 col-lg-6 col-xl-8 d-flex">
          <a
            href="blog-single.html"
            className="img w-100 mb-3 mb-md-0"
            style={{
              backgroundImage: `url("/app/assets/img/image_1.jpg")`,
            }}
          ></a>
        </div>
        <div className="col-md-6 col-lg-6 col-xl-4 d-flex">
          <div className="text w-100 pl-md-3 d-flex flex-column justify-content-center">
            <span className="story-type">{story_type}</span>
            <h2>
              <a href="blog-single.html" className="story-title">
                {title}
              </a>
            </h2>
            <ul className="media-social list-unstyled">
              <li className="ftco-animate fadeInUp ftco-animated">
                <a href="#">
                  <span className="icon-twitter"></span>
                </a>
              </li>
              <li className="ftco-animate fadeInUp ftco-animated">
                <a href="#">
                  <span className="icon-facebook"></span>
                </a>
              </li>
              <li className="ftco-animate fadeInUp ftco-animated">
                <a href="#">
                  <span className="icon-instagram"></span>
                </a>
              </li>
            </ul>
            <div className="meta">
              <p className="mb-0">
                <a href="#" className="story-created-at">
                  {formatSlashDate(created_at)}
                </a>
                {" | "}
                <a href="#" className="story-read-time">
                  12 min read
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleComponent;
