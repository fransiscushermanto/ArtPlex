import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory, Prompt } from "react-router-dom";
import hljs from "highlight.js";
import ReactQuill, { Quill } from "react-quill";
import axios from "axios";
import ImageResize from "quill-image-resize-module";

import { restrictedKey, totalWord } from "../Function/Factories";
import ToolbarEditor from "../Function/ToolbarEditor";
import PublishModal from "../Modals/PublishModals";
import CheckMail from "../Auth/CheckMail";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import "highlight.js/styles/darcula.css";

let Block = Quill.import("blots/block");
let Delta = Quill.import("delta");

var titleChange = new Delta();
var bodyChange = new Delta();
hljs.configure({
  languages: [
    "javascript",
    "ruby",
    "python",
    "rust",
    "php",
    "html",
    "c#",
    "c",
    "css",
    "scss",
    "kotlin",
    "c++",
    "java",
    "typescript",
    "go",
    "nginx config",
    "swift",
    "Arduino",
    "Django",
  ],
});

Quill.register("modules/imageResize", ImageResize);

const StoryEditor = ({ user }) => {
  let { storyId, type } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(null);
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [shown, setShown] = useState({ title: "", body: "" });
  const [openSendEmailPage, setOpenSendEmailPage] = useState(false);
  const quillRef = useRef(null);
  const titleQuillRef = useRef(null);
  let timer,
    timeoutVal = 10000;

  useEffect(() => {
    // window.location.lasthash.Push(window.location.hash);

    if (document.getElementById("body-editable")) {
      document.getElementById("body-editable").focus();
    }
    if (storyId) {
      const data = new FormData();
      data.append("story_id", storyId);
      data.append("user_id", user.id);
      data.append("type", type);
      axios.post("/api/actions/get_story.php", data).then((res) => {
        setCategories(res.data.categories);
        setStatus(res.data.status);
        setTitle(res.data.title_html);
        setBody(res.data.body_html);
        setShown({ title: res.data.title, body: res.data.body });
        titleChange = new Delta();
        bodyChange = new Delta();
      });
    }
  }, []);

  useEffect(() => {
    document.getElementsByTagName("body")[0].style.overflowY = modal
      ? "hidden"
      : "scroll";
  }, [modal]);

  useEffect(() => {
    if (quillRef.current !== null) {
      var tooltip_controls = document.getElementById("tooltip-controls");
      var sidebar_controls = document.getElementById("sidebar-controls");
      const quill = quillRef.current.editor;
      quill.addContainer(tooltip_controls);
      quill.addContainer(sidebar_controls);
      quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
        if (eventType !== Quill.events.SELECTION_CHANGE) return;
        if (range == null) return;
        if (range.length === 0) {
          tooltip_controls.style.display = "none";
          let [block, offset] = quill.scroll.descendant(Block, range.index);
          if (
            block != null &&
            block.domNode.firstChild instanceof HTMLBRElement
          ) {
            let lineBounds = quill.getBounds(range);
            sidebar_controls.classList.remove("active");
            sidebar_controls.style.display = "block";
            sidebar_controls.style.left = `${lineBounds.left - 50}px`;
            sidebar_controls.style.top = `${lineBounds.top - 2}px`;
          } else {
            tooltip_controls.style.display = sidebar_controls.style.display =
              "none";
            sidebar_controls.classList.remove("active");
          }
        } else {
          sidebar_controls.style.display = "none";
          sidebar_controls.classList.remove("active");
        }
      });
    }
  }, [quillRef]);

  const sendMail = () => {
    const data = new FormData();
    data.append("email", user.email);
    data.append("type", "verify");
    axios.post("/api/actions/send_mail.php", data);
  };

  const sendEmailVerification = () => {
    setOpenSendEmailPage(true);
    document.getElementById("ftco-navbar").style.display = "none";
    sendMail();
  };

  const handleTitleChange = (text, delta, source, editor) => {
    setTitle(text);
    titleChange = titleChange.compose(delta);
  };

  const handleBodyChange = (text, delta, source, editor) => {
    setBody(text);
    bodyChange = bodyChange.compose(delta);
  };

  const handleStillTyping = (e) => {
    setTyping(true);
    clearTimeout(timer);
  };

  const handleAutoSave = () => {
    if (!typing) {
      if (titleChange.length() > 0 && bodyChange.length() > 0) {
        setSaved(false);
        titleChange = new Delta();
        bodyChange = new Delta();
      } else if (titleChange.length() > 0) {
        setSaved(false);
        titleChange = new Delta();
      } else if (bodyChange.length() > 0) {
        setSaved(false);
        bodyChange = new Delta();
      }
    }
  };

  useEffect(() => {
    timer = setTimeout(() => {
      setTyping(false);
      console.log("STOP TYPING");
    }, timeoutVal);
    return () => clearTimeout(timer);
  }, [title, body]);

  const sendToServer = async () => {
    const titleQuill = titleQuillRef.current.editor;
    const bodyQuill = quillRef.current.editor;
    const total_word = titleQuill.getLength() - 1 + (bodyQuill.getLength() - 1);
    const data = new FormData();

    if (storyId) {
      data.append("story_id", storyId);
    }
    data.append("user_id", user.id);
    data.append("title_html", title);
    data.append("body_html", body);
    data.append("body", bodyQuill.getContents(0).ops[0].insert);
    data.append("title", titleQuill.getText());
    data.append("total_word", total_word);
    const res = await axios.post("/api/actions/story_write.php", data);
    console.log(res.data);
    if (storyId) {
      if (res.data.success) {
        setSaved(true);
        console.log("SAVEd");
      }
    } else {
      if (res.data.success) {
        setSaved(true);
        history.push(`/p/${res.data.story_id}/edit`);
      }
    }
  };

  useEffect(() => {
    window.addEventListener(
      "keydown",
      function(e) {
        if (
          (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
          e.keyCode == 83
        ) {
          if (titleChange.length() > 0 && bodyChange.length() > 0) {
            setSaved(false);
            titleChange = bodyChange = new Delta();
          } else if (titleChange.length() > 0) {
            setSaved(false);
            titleChange = new Delta();
          } else if (bodyChange.length() > 0) {
            setSaved(false);
            bodyChange = new Delta();
          } else {
            e.preventDefault();
          }
        }
      },
      false
    );

    return window.removeEventListener("keydown", function(e) {
      titleChange = new Delta();
      bodyChange = new Delta();
    });
  }, []);

  const handleKeySave = (e) => {
    if (restrictedKey(e.keyCode)) {
      if (
        (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        e.keyCode == 83
      ) {
        console.log("HANDLE KEY SAVE");
        if (titleChange.length() > 0 && bodyChange.length() > 0) {
          setSaved(false);
          titleChange = bodyChange = new Delta();
        } else if (titleChange.length() > 0) {
          setSaved(false);
          titleChange = new Delta();
        } else if (bodyChange.length() > 0) {
          setSaved(false);
          bodyChange = new Delta();
        } else {
          e.preventDefault();
        }
      }
    }
  };

  useEffect(() => {
    handleAutoSave();
  }, [typing]);

  useEffect(() => {
    if (type) {
      if (
        type === "edit" &&
        saved === null &&
        titleChange.length() > 0 &&
        bodyChange.length() > 0
      ) {
        titleChange = new Delta();
        bodyChange = new Delta();
        setSaved(true);
      }
    }
  }, [type, saved, title, body]);

  useEffect(() => {
    if (saved === false && saved !== null) {
      sendToServer();
    }
  }, [title, body, saved]);

  window.onpopstate = function(e) {
    if (titleChange.length() > 0 || bodyChange.length() > 0) {
      e.preventDefault();
      return "There are unsaved changes. Are you sure you want to leave?";
    }
  };

  window.onbeforeunload = function() {
    if (titleChange.length() > 0 || bodyChange.length() > 0) {
      return "There are unsaved changes. Are you sure you want to leave?";
    }
  };

  return openSendEmailPage ? (
    <CheckMail email={user.email} type={"verify"} />
  ) : (
    <>
      {modal ? (
        <PublishModal
          status={status}
          setModal={setModal}
          user_id={user.id}
          titleParams={shown.title}
          bodyParams={shown.body}
          story_id={storyId}
          sendEmailVerification={sendEmailVerification}
          displayImage={
            document.getElementsByTagName("img").length > 0
              ? document.getElementsByTagName("img")[0].currentSrc
              : null
          }
          loaded_categories={categories}
        />
      ) : null}
      <div id="new-story" className="container new-story-wrapper height-100">
        <Prompt
          when={bodyChange.length() > 0 || titleChange.length() > 0}
          message={"There are unsaved changes. Are you sure you want to leave?"}
        />
        <div className="col height-100">
          <div className="row">
            <div className="title" id="title">
              <ReactQuill
                className="title-editable"
                theme={"bubble"}
                ref={titleQuillRef}
                onChange={handleTitleChange}
                value={title}
                formats={StoryEditor.titleFormats}
                placeholder={"Title"}
                modules={StoryEditor.titleModules}
                onKeyPress={handleStillTyping}
                onKeyDown={handleKeySave}
              />
            </div>
          </div>
          <div className="row">
            <div className="body">
              <ToolbarEditor quillRef={quillRef} />
              <ReactQuill
                ref={quillRef}
                className="body-editable"
                id="body-editable"
                theme={"bubble"}
                onChange={handleBodyChange}
                value={body}
                formats={StoryEditor.formats}
                placeholder={"Body"}
                modules={StoryEditor.modules}
                bounds={"#body-editable"}
                onKeyPress={handleStillTyping}
                onKeyDown={handleKeySave}
              />
            </div>
          </div>
        </div>

        <div className="floating-button" title="Publish">
          <div
            className={
              (saved && type === "edit") || type === "edit"
                ? "action-btn "
                : "action-btn disabled"
            }
            onClick={() => {
              setModal(!modal);
              if (bodyChange.length() > 0 || titleChange.length() > 0) {
                sendToServer();
                bodyChange = new Delta();
                titleChange = new Delta();
              } else {
                setSaved(null);
              }
            }}
          >
            <i className="fa fa-upload" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </>
  );
};

StoryEditor.modules = {
  imageResize: {
    handleStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
      // other camelCase styles for size display
    },
    toolbarStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
      // other camelCase styles for size display
    },
  },
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [
      { header: "1" },
      { header: "2" },
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "video",
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
      "link",
      "code-block",
      "clean",
    ],
  ],
  clink: true,
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

StoryEditor.titleModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic", "underline", "strike"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

StoryEditor.titleFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "formats/hr",
  "hr",
];

StoryEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "image",
  "bullet",
  "indent",
  "link",
  "formats/hr",
  "code-block",
  "video",
  "hr",
];

export default StoryEditor;
