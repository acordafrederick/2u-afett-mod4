import "../../css/style.scss";

const mainContentEl = document.querySelector("#main-content"); // Provided by Tamar Auber
const alertBoxEl = document.querySelector("#alert-box"); // Provided by Tamar Auber
const roomIdEl = document.querySelector("#room-id"); // 4.1.6 Update Room to Display Room URL for Copying
const clipboardBtn = document.querySelector("#clipboard-btn"); // 4.1.6 Copy Room URL with Clipboard API
const localUserEl = document.querySelector("#local-username"); // Provided by Tamar Auber
const remoteUserEl = document.querySelector("#remote-username"); // Provided by Tamar Auber
const startCallBtnEl = document.querySelector("#start-call-btn"); // Provided by Tamar Auber
const stopCallBtnEl = document.querySelector("#stop-call-btn"); // Provided by Tamar Auber

let roomId = null; // 4.1.6 Update Room to Display Room URL for Copying

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
}; // 4.1.6 Update Room to Display Room URL for Copying

const getRoomId = () => {
  const params = getQueryStringParams(document.location.search);
  roomId = params.roomId;
  roomIdEl.textContent = roomId;
  return params.roomId;
}; // 4.1.6 Update Room to Display Room URL for Copying

getRoomId(); // 4.1.6 Update Room to Display Room URL for Copying

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
}; // 4.1.6 Copy Room URL with Clipboard API

clipboardBtn.addEventListener("click", copyToClipboard); // 4.1.6 Copy Room URL with Clipboard API
