import React from "react";

const DeleteModals = ({ setModal, onClick, param }) => {
  return (
    <div className="modals-wrapper" style={{ overflow: "hidden" }}>
      <div className="content-modals">
        <div className="header">
          <div className="title">Delete</div>
          <div className="subtitle">
            Deleted stories are gone forever. Are you sure?
          </div>
        </div>
        <div className="btn-action">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              onClick(param);
              setModal(false);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="r s ib ic id ie if ig ih close-button">
        <div className="ii r s v inner-close-button">
          <span className="bw b bx by bz ca r cb cc">
            <button
              className="ct cu bg bh bi bj bk bl bm bn cv cw bq cx cy"
              data-testid="close-button"
              onClick={() => setModal(false)}
            >
              <svg className="x-29px_svg__svgIcon-use" width="29" height="29">
                <path
                  d="M20.13 8.11l-5.61 5.61-5.6-5.61-.81.8 5.61 5.61-5.61 5.61.8.8 5.61-5.6 5.61 5.6.8-.8-5.6-5.6 5.6-5.62"
                  fillRule="evenodd"
                ></path>
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeleteModals;
