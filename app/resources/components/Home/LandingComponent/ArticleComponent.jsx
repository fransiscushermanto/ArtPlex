import React from "react";

const ArticleComponent = ({ title, body, image_source }) => {
  return (
    <div className="card">
      <div className="card-body d-flex flex-column justify-content-start">
        <div className="icon-wrapper">
          <img src={image_source} alt="" />
        </div>
        <div className="description d-flex flex-column justify-content-center align-items-center">
          <h1>{title}</h1>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleComponent;
