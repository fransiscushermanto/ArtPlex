import React from "react";

const CommentEditor = ({
  btn_negative_text,
  btn_positive_text,
  setNegativeButton,
  setPositiveButton,
  allowSubmit,
  editor,
}) => {
  return (
    <div className="col">
      <div className="wrapper-editable width-100">{editor}</div>
      <div className="row d-flex flex-row justify-content-end width-100">
        <button className="btn" onClick={setNegativeButton}>
          {btn_negative_text}
        </button>
        <button
          className="btn submit"
          disabled={allowSubmit ? false : true}
          onClick={setPositiveButton}
        >
          {btn_positive_text}
        </button>
      </div>
    </div>
  );
};

export default CommentEditor;
