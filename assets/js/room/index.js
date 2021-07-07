import "../../css/style.scss";
// lesson 1
const mainContentEl = document.querySelector("#main-content");
const alertBoxEl = document.querySelector("#alert-box");
const roomIdEl = document.querySelector("#room-id");
const clipboardBtn = document.querySelector("#clipboard-btn");
const localUserEl = document.querySelector("#local-username");
const remoteUserEl = document.querySelector("#remote-username");
const startCallBtnEl = document.querySelector("#start-call-btn");
const stopCallBtnEl = document.querySelector("#stop-call-btn");
// lesson 1
let roomId = null;
// lesson 1 (no refactor)
const getQueryStringParams = (query) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          let [key, value] = param.split("=");
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          return params;
        }, {})
    : {};
};
// lesson 1 (no refactor)
const getRoomId = () => {
  const params = getQueryStringParams(document.location.search);
  // save roomId for reference
  roomId = params.roomId;
  roomIdEl.textContent = roomId;
  return params.roomId;
};
// lesson 1
const copyToClipboard = async () => {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return;
  }
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {
    console.error("Failed to copy!", err);
  }
};
// lesson 1
clipboardBtn.addEventListener("click", copyToClipboard);
getRoomId();
