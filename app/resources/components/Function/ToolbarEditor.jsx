import React from "react";
import axios from "axios";
import { Quill } from "react-quill";

import myApp from "myApp";

let Inline = Quill.import("blots/inline");
let BlockEmbed = Quill.import("blots/block/embed");

class BoldBlot extends Inline {}
BoldBlot.blotName = "bold";
BoldBlot.tagName = "strong";

class ItalicBlot extends Inline {}
ItalicBlot.blotName = "italic";
ItalicBlot.tagName = "em";

class LinkBlot extends Inline {
  static create(value) {
    let node = super.create();
    // Sanitize url value if desired
    node.setAttribute("href", value);
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute("target", "_blank");
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute("href");
  }
}
LinkBlot.blotName = "link";
LinkBlot.tagName = "a";

class DividerBlot extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    return node;
  }
}
DividerBlot.blotName = "hr";
DividerBlot.className = "divider";
DividerBlot.tagName = "hr";

class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("alt", value.alt);
    node.setAttribute("src", value.url);
    node.setAttribute("class", value.class);
    return node;
  }

  static value(node) {
    return {
      alt: node.getAttribute("alt"),
      url: node.getAttribute("src"),
    };
  }
}
ImageBlot.blotName = "image";
ImageBlot.tagName = "img";

class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute("src", url);
    // Set non-format related attributes with static values
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", true);

    return node;
  }

  static formats(node) {
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute("height")) {
      format.height = node.getAttribute("height");
    }
    if (node.hasAttribute("width")) {
      format.width = node.getAttribute("width");
    }
    return format;
  }

  static value(node) {
    return node.getAttribute("src");
  }

  format(name, value) {
    // Handle unregistered embed formats
    if (name === "height" || name === "width") {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = "video";
VideoBlot.tagName = "iframe";

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(LinkBlot);
Quill.register(ImageBlot);
Quill.register(VideoBlot);
Quill.register({ "formats/hr": DividerBlot });

Quill.register("modules/clink", (quill) => {
  let currentLink = null;
  quill.container.addEventListener("mouseover", (evt) => {
    if (evt.target.tagName === "A") {
      currentLink = evt.target;
      currentLink.setAttribute("contenteditable", false);
    } else if (currentLink) {
      currentLink.removeAttribute("contenteditable");
      currentLink = null;
    }
  });
});

__webpack_public_path__ = `${window.STATIC_URL}app/assets/temp-img`;

const ToolBarEditor = ({ quillRef }) => {
  const { user } = myApp;

  const boldText = () => {
    const quill = quillRef.current.editor;
    quill.format("bold", true);
  };

  const italicText = () => {
    const quill = quillRef.current.editor;
    quill.format("italic", true);
  };

  const linkText = () => {
    const quill = quillRef.current.editor;
    let url = prompt("Enter link URL");
    quill.format("link", url);
  };

  const dividerText = () => {
    const quill = quillRef.current.editor;
    let range = quill.getSelection(true);

    quill.insertText(range.index, "\n", "user");
    quill.insertEmbed(range.index + 1, "hr", "null");
    quill.setSelection(range.index + 2, "silent");
  };

  const imageText = () => {
    const quill = quillRef.current.editor;
    let range = quill.getSelection(true);
    var file = document.createElement("input");
    file.setAttribute("type", "file");
    file.setAttribute("style", "display:none");
    file.setAttribute("id", "artplex-img");
    var ele = document.getElementById("title");
    ele.appendChild(file);
    var img = document.getElementById("artplex-img");
    img.click();
    img.addEventListener("change", async function() {
      if (img.files && img.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", async function(e) {
          const data = new FormData();
          data.append("file", img.files[0]);
          data.append("user_id", user.id);
          data.append("file_name", e.target.result);
          const res = await axios.post("/api/actions/store_image.php", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (res.data.success) {
            quill.insertText(range.index, "\n", "user");
            quill.insertEmbed(
              range.index + 1,
              "image",
              {
                url: res.data.url,
                alt: img.files[0].name,
                class: "artplex-image",
              },
              "user"
            );
            quill.setSelection(range.index + 2, "silent");
          } else {
            console.log(res.data.error);
          }
        });

        FR.readAsDataURL(img.files[0]);
      }
    });
    ele.removeChild(img);
  };

  const showControl = () => {
    const quill = quillRef.current.editor;
    const sidebar_controls = document.getElementById("sidebar-controls");
    if (sidebar_controls.classList[0] === "active") {
      sidebar_controls.classList.remove("active");
    } else {
      sidebar_controls.classList.add("active");
    }
    quill.focus();
  };

  const videoText = () => {
    const quill = quillRef.current.editor;
    let range = quill.getSelection(true);
    quill.insertText(range.index, "\n", Quill.sources.USER);
    let url = "https://www.youtube.com/embed?v=ZUdd4N5NdCY";
    quill.insertEmbed(range.index + 1, "video", url, Quill.sources.USER);
    quill.formatText(range.index + 1, 1, { height: "170", width: "400" });
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
  };

  return (
    <div>
      <div id="tooltip-controls">
        <button id="bold-button" onClick={boldText}>
          <i className="fa fa-bold"></i>
        </button>
        <button id="italic-button" onClick={italicText}>
          <i className="fa fa-italic"></i>
        </button>
        <button id="link-button" onClick={linkText}>
          <i className="fa fa-link"></i>
        </button>
        <button id="blockquote-button">
          <i className="fa fa-quote-right"></i>
        </button>
        <button id="header-1-button">
          <i className="fa fa-header">
            <sub>1</sub>
          </i>
        </button>
        <button id="header-2-button">
          <i className="fa fa-header">
            <sub>2</sub>
          </i>
        </button>
      </div>
      <div id="sidebar-controls">
        <button id="show-controls" onClick={showControl}>
          <span className="svgIcon svgIcon--addMediaPlus svgIcon--25px">
            <svg className="svgIcon-use" width="25" height="25">
              <path
                d="M20 12h-7V5h-1v7H5v1h7v7h1v-7h7"
                fillRule="evenodd"
              ></path>
            </svg>
          </span>
        </button>
        <span className="controls">
          <button id="image-button" onClick={imageText}>
            <span className="svgIcon svgIcon--addMediaImage svgIcon--25px">
              <svg className="svgIcon-use" width="25" height="25">
                <g fillRule="evenodd">
                  <path d="M4.042 17.05V8.857c0-1.088.842-1.85 1.935-1.85H8.43C8.867 6.262 9.243 5 9.6 5.01L15.405 5c.303 0 .755 1.322 1.177 2 0 .077 2.493 0 2.493 0 1.094 0 1.967.763 1.967 1.85v8.194c-.002 1.09-.873 1.943-1.967 1.943H5.977c-1.093.007-1.935-.85-1.935-1.937zm2.173-9.046c-.626 0-1.173.547-1.173 1.173v7.686c0 .625.547 1.146 1.173 1.146h12.683c.625 0 1.144-.53 1.144-1.15V9.173c0-.626-.52-1.173-1.144-1.173h-3.025c-.24-.63-.73-1.92-.873-2 0 0-5.052.006-5 0-.212.106-.87 2-.87 2l-2.915.003z"></path>
                  <path d="M12.484 15.977a3.474 3.474 0 0 1-3.488-3.49A3.473 3.473 0 0 1 12.484 9a3.474 3.474 0 0 1 3.488 3.488c0 1.94-1.55 3.49-3.488 3.49zm0-6.08c-1.407 0-2.59 1.183-2.59 2.59 0 1.408 1.183 2.593 2.59 2.593 1.407 0 2.59-1.185 2.59-2.592 0-1.406-1.183-2.592-2.59-2.592z"></path>
                </g>
              </svg>
            </span>
          </button>
          <button id="video-button" onClick={videoText}>
            <span className="svgIcon svgIcon--addMediaVideo svgIcon--25px">
              <svg className="svgIcon-use" width="25" height="25">
                <path
                  d="M18.8 11.536L9.23 5.204C8.662 4.78 8 5.237 8 5.944v13.16c0 .708.662 1.165 1.23.74l9.57-6.33c.514-.394.606-1.516 0-1.978zm-.993 1.45l-8.294 5.267c-.297.213-.513.098-.513-.264V7.05c0-.36.218-.477.513-.264l8.294 5.267c.257.21.257.736 0 .933z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </span>
          </button>
          <button id="divider-button" onClick={dividerText}>
            <span className="svgIcon svgIcon--addMediaPart svgIcon--25px">
              <svg className="svgIcon-use" width="25" height="25">
                <g fillRule="evenodd">
                  <path d="M8.45 12H5.3c-.247 0-.45.224-.45.5 0 .274.203.5.45.5h5.4c.247 0 .45-.226.45-.5 0-.276-.203-.5-.45-.5H8.45z"></path>
                  <path d="M17.45 12H14.3c-.247 0-.45.224-.45.5 0 .274.203.5.45.5h5.4c.248 0 .45-.226.45-.5 0-.276-.202-.5-.45-.5h-2.25z"></path>
                </g>
              </svg>
            </span>
          </button>
        </span>
      </div>
    </div>
  );
};

export default ToolBarEditor;
