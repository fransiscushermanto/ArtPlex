import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
const SidePane = ({ openSidePane, type }) => {
  let { url } = useRouteMatch();
  const [listMenu, setListMenu] = useState([
    {
      class: "users",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="user"
          className="svg-inline--fa fa-user fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
          ></path>
        </svg>
      ),
      text: "Users",
      active: false,
    },
    {
      class: "stories",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="book"
          className="svg-inline--fa fa-book fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"
          ></path>
        </svg>
      ),
      text: "Stories",
      active: false,
    },
    {
      class: "comments",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="comment"
          className="svg-inline--fa fa-comment fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"
          ></path>
        </svg>
      ),
      text: "Comments",
      active: false,
    },
    {
      class: "categories",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="hashtag"
          className="svg-inline--fa fa-hashtag fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M440.667 182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123 38.754 371.468 32 363.997 32h-40.632a12 12 0 0 0-11.813 9.891L296.175 128H197.54l14.623-81.891C213.477 38.754 207.822 32 200.35 32h-40.632a12 12 0 0 0-11.813 9.891L132.528 128H53.432a12 12 0 0 0-11.813 9.891l-7.143 40C33.163 185.246 38.818 192 46.289 192h74.81L98.242 320H19.146a12 12 0 0 0-11.813 9.891l-7.143 40C-1.123 377.246 4.532 384 12.003 384h74.81L72.19 465.891C70.877 473.246 76.532 480 84.003 480h40.632a12 12 0 0 0 11.813-9.891L151.826 384h98.634l-14.623 81.891C234.523 473.246 240.178 480 247.65 480h40.632a12 12 0 0 0 11.813-9.891L315.472 384h79.096a12 12 0 0 0 11.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12 12 0 0 0 11.813-9.891zM261.889 320h-98.634l22.857-128h98.634l-22.857 128z"
          ></path>
        </svg>
      ),
      text: "Categories",
      active: false,
    },
  ]);

  const setActive = (menu) => {
    const tempMenu = [...listMenu];
    tempMenu.map((menu) => {
      if (menu.active) {
        menu.active = false;
      }
    });
    const index = tempMenu.indexOf(menu);
    tempMenu[index].active = true;
    setListMenu(tempMenu);
  };

  const renderListMenu = () => {
    return listMenu.map((menu, index) => {
      return (
        <li
          key={index}
          className={
            menu.active
              ? `${menu.class} d-flex justify-content-center active`
              : `${menu.class} d-flex justify-content-center`
          }
        >
          <Link
            to={`${url}/${menu.class}`}
            onClick={() => setActive(menu)}
            className="width-100 no-animation"
          >
            {menu.icon}
            <span>{menu.text}</span>
          </Link>
        </li>
      );
    });
  };

  const setActiveByType = () => {
    const tempMenu = [...listMenu];
    tempMenu.map((menu) => {
      if (menu.class === type) {
        menu.active = true;
      }
    });

    setListMenu(tempMenu);
  };

  useEffect(() => {
    setActiveByType();
  }, [type]);

  return (
    <CSSTransition
      in={openSidePane}
      timeout={200}
      classNames="toggle-side-pane"
      unmountOnExit
    >
      <div className="side-pane">
        <div className="logo">
          <h1>
            <Link className="no-animation" to={`${window.location.pathname}`}>
              <b>ArtPlex</b>
            </Link>
          </h1>
        </div>
        <div className="list-menu">
          <ul>{renderListMenu()}</ul>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SidePane;
