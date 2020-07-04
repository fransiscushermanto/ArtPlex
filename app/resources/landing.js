import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArticleComponent from "./components/Home/LandingComponent/ArticleComponent";

import myApp from "myApp";
__webpack_public_path__ = `${window.STATIC_URL}app/assets/img`;
const ArticleGroup = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => setLoading(false);
  }, [loading]);

  const renderArticle = () => {
    console.log(articles);
    return articles.map((article, index) => {
      return (
        <ArticleComponent key={index} article={article}></ArticleComponent>
      );
    });
  };

  return loading ? (
    <div className="col-md-12 d-flex justify-content-center">
      <CircularProgress size="40px" color="inherit" />
    </div>
  ) : (
    <section className="landing-phase height-100 width-100">
      <div className="container">
        <div className="services row d-flex flex-row width-100 justify-content-center">
          <ArticleComponent
            image_source={`${__webpack_public_path__}/icons8-ball-point-pen-100.png`}
            title={"Author"}
            body={"Write the best article of yours and let the world see."}
          ></ArticleComponent>
          <ArticleComponent
            image_source={`${__webpack_public_path__}/icons8-ereader-100.png`}
            title={"Reader"}
            body={
              "Explore article at article complex and find something inspiring for you."
            }
          ></ArticleComponent>
        </div>
      </div>
      <div className="join-us">
        <div className="overlay"></div>
        <div className="row">
          <div className="col d-flex flex-column align-items-center justify-content-center">
            <div className="width-100">
              <h1>Interested? </h1>
            </div>
            <div className="width-100">
              <h2>Let's explore more articles.</h2>
            </div>
          </div>
          <div className="col d-flex align-items-center justify-content-end">
            <a href="/login" className="btn btn-outline-light">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleGroup;

if (document.getElementById("card-wrapper")) {
  ReactDOM.render(<ArticleGroup />, document.getElementById("card-wrapper"));
}
