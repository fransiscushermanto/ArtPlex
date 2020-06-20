import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import ArticleComponent from "./components/Home/Articles/ArticleComponent";

import myApp from "myApp";
const ArticleGroup = () => {
  const { articles } = myApp;

  const renderArticle = () => {
    return articles.map((article, index) => {
      return (
        <ArticleComponent key={index} article={article}></ArticleComponent>
      );
    });
  };

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">{renderArticle()}</div>
        </div>
      </div>
    </section>
  );
};

export default ArticleGroup;

if (document.getElementById("article-wrapper")) {
  ReactDOM.render(<ArticleGroup />, document.getElementById("article-wrapper"));
}
