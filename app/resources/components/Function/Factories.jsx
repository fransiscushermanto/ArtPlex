export function formatSlashDate(date) {
  const temp = new Date(date);

  return `${temp.getDate().toString().length > 1 ? "" : 0}${temp.getDate()}/${
    temp.getMonth().toString().length > 1 ? "" : 0
  }${temp.getMonth()}/${temp.getFullYear()}`;
}

export function escapeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<div><br><\/div>/g, "\n")
    .replace(/<div>/g, "\n")
    .replace(/<\/div>/g, "")
    .replace(/<br>/g, "\n")
    .replace(/&nbsp;/, " ")
    .replace(/<p>/, "")
    .replace(/<\/p>/, "")
    .replace(/<h1>/, "")
    .replace(/<\/h1>/, "");
}

export function restrictedKey(keyCode) {
  const arrKey = [
    { key: 18, status: false },
    { key: 37, status: false },
    { key: 38, status: false },
    { key: 39, status: false },
    { key: 40, status: false },
    { key: 20, status: false },
    { key: 17, status: false },
    { key: 46, status: false },
    { key: 35, status: false },
    { key: 27, status: false },
    { key: 112, status: false },
    { key: 113, status: false },
    { key: 114, status: false },
    { key: 115, status: false },
    { key: 116, status: false },
    { key: 117, status: false },
    { key: 118, status: false },
    { key: 119, status: false },
    { key: 120, status: false },
    { key: 121, status: false },
    { key: 122, status: false },
    { key: 123, status: false },
    { key: 36, status: false },
    { key: 144, status: false },
    { key: 33, status: false },
    { key: 34, status: false },
    { key: 16, status: false },
    { key: 91, status: false },
  ];

  const res = arrKey.filter((key) => key.key === keyCode);

  return res.length > 0 ? res[0].status : true;
}

export function detectOnBlur(ref, state, setState) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (state === true) {
        setState(false);
      }
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
}

export function calculateSpeed(length) {
  const perMinute = 200;
  return Math.round(length / perMinute);
}
