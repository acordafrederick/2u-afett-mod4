import "../../css/style.scss";
import { renderFilterOptions, handleUpdateFilter, setCanvas } from "./canvas";
import { joinRoom, sendMessage } from "./firebase";

const username = `user-${Math.round(Math.random() * 100000)}`;

const filterOptionsSelectEl = document.querySelector("#filter-options");

const mainContentEl = document.querySelector("#main-content"); // Provided by Tamar Auber
const alertBoxEl = document.querySelector("#alert-box"); // Provided by Tamar Auber
const roomIdEl = document.querySelector("#room-id"); // 4.1.6 Update Room to Display Room URL for Copying
const clipboardBtn = document.querySelector("#clipboard-btn"); // 4.1.6 Copy Room URL with Clipboard API
const localUserEl = document.querySelector("#local-username"); // Provided by Tamar Auber
const remoteUserEl = document.querySelector("#remote-username"); // Provided by Tamar Auber
const startCallBtnEl = document.querySelector("#start-call-btn"); // Provided by Tamar Auber
const stopCallBtnEl = document.querySelector("#stop-call-btn"); // Provided by Tamar Auber

const localVideoEl = document.querySelector("#local-video"); // 4.2.3 Build Video Element
const remoteVideoEl = document.querySelector("#remote-video"); // 4.2.3 Build Video Element

const localCanvasEl = document.querySelector("#local-canvas"); // 4.2.4 Set Up Canvas on Page
const remoteCanvasEl = document.querySelector("#remote-canvas"); // 4.2.4 Set Up Canvas on Page

let roomId = null; // 4.1.6 Update Room to Display Room URL for Copying
let stream = null; // 4.2.3 Stream Webcam to Page

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

const startVideo = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, ideal: 1920 },
        height: { min: 400, ideal: 1080 },
        aspectRatio: { ideal: 1.7777777778 },
      },
      audio: true,
    });
    localVideoEl.srcObject = mediaStream;
    stream = mediaStream;
    setCanvas(localCanvasEl, localVideoEl);

    return mediaStream;
  } catch (err) {
    console.error(err);
  }
};

const handleSelectChange = (event) => {
  handleUpdateFilter(event.target.value);
  sendMessage({ messageType: "CANVAS_FILTER", message: event.target.value });
};

const initializeVideoChat = async () => {
  // get the room id
  const roomId = getRoomId();

  // write username to page
  localUserEl.textContent = username;

  try {
    const videoStream = await startVideo();
    // join the room
    const successfullyJoined = await joinRoom(roomId, username, {
      handleUserPresence,
    });

    // if room is full or an error occurs close it off
    if (!successfullyJoined) {
      mainContentEl.classList.add("hidden");
      alertBoxEl.classList.remove("hidden");
      return;
    }

    // if not, make sure main content is displaying
    mainContentEl.classList.remove("hidden");
    alertBoxEl.classList.add("hidden");
  } catch (err) {
    console.log(err);
    mainContentEl.classList.add("hidden");
    alertBoxEl.classList.remove("hidden");
  }
};

const handleUserPresence = (isPresent, username) => {
  if (isPresent) {
    startCallBtnEl.removeAttribute("disabled");
    remoteUserEl.textContent = username;
  } else {
    startCallBtnEl.setAttribute("disabled", true);
    remoteUserEl.textContent = "No remote user";
  }
};

filterOptionsSelectEl.addEventListener("change", handleSelectChange);

clipboardBtn.addEventListener("click", copyToClipboard); // 4.1.6 Copy Room URL with Clipboard API

renderFilterOptions(filterOptionsSelectEl);
initializeVideoChat();
