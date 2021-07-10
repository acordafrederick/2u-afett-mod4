import "../../css/style.scss";

import {
  renderFilterOptions,
  handleUpdateFilter,
  setCanvas,
  handleUpdateRemoteFilter,
} from "./canvas";
import { joinRoom, sendMessage } from "./firebase";

import {
  initializePeerListeners,
  openPeerConnection,
  createOffer,
  closeConnection,
} from "./webrtc";

// added 4.5.3
import { getNotificationPermission, sendNotification } from "./notifications";

// lesson 1
const mainContentEl = document.querySelector("#main-content");
const alertBoxEl = document.querySelector("#alert-box");
const roomIdEl = document.querySelector("#room-id");
const clipboardBtn = document.querySelector("#clipboard-btn");
const localUserEl = document.querySelector("#local-username");
const remoteUserEl = document.querySelector("#remote-username");

// lesson 2
const localVideoEl = document.querySelector("#local-video");
const localCanvasEl = document.querySelector("#local-canvas");
const filterOptionsSelectEl = document.querySelector("#filter-options");

// lesson 2
const remoteVideoEl = document.querySelector("#remote-video");
const remoteCanvasEl = document.querySelector("#remote-canvas");

// lesson 1
const startCallBtnEl = document.querySelector("#start-call-btn");
const stopCallBtnEl = document.querySelector("#stop-call-btn");

// lesson 3
const username = `user-${Math.round(Math.random() * 100000)}`;
// lesson 1
let roomId = null;

let stream = null;
let remoteStream = null;
// lesson 4
let peerConnectionHandlers = null;

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

// lesson 2 (no refactor)
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

// lesson 2 (update in 4)
const handleSelectChange = (event) => {
  handleUpdateFilter(event.target.value);
  sendMessage({ messageType: "CANVAS_FILTER", message: event.target.value });
};

// lesson 3 (refactor in lesson 4)
const initializeVideoChat = async () => {
  // get the room id
  const roomId = getRoomId();

  // write username to page
  localUserEl.textContent = username;

  try {
    const videoStream = await startVideo();

    peerConnectionHandlers = initializePeerListeners(
      sendMessage,
      handleStartRemoteVideo,
      videoStream
    );
    // join the room
    const successfullyJoined = await joinRoom(roomId, username, {
      handleUserPresence,
      handleUpdateRemoteFilter,
      stopCall,
      ...peerConnectionHandlers,
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

// lesson 3; updated 4.5.3
const handleUserPresence = (isPresent, username) => {
  if (isPresent) {
    startCallBtnEl.removeAttribute("disabled");
    remoteUserEl.textContent = username;
    sendNotification("online");
  } else {
    startCallBtnEl.setAttribute("disabled", true);
    stopCallBtnEl.setAttribute("disabled", true);
    remoteUserEl.textContent = "No remote user";
    sendNotification("offline");
  }
};

// lesson 4
const handleStartCall = async () => {
  try {
    await openPeerConnection(stream);
    createOffer(sendMessage);
    startCallBtnEl.setAttribute("disabled", true);
    stopCallBtnEl.removeAttribute("disabled");
  } catch (err) {
    console.log(err);
  }
};

// lesson 4; updated 4.5.3
const handleStartRemoteVideo = (mediaStream) => {
  if (!remoteStream) {
    remoteVideoEl.srcObject = mediaStream;
    remoteStream = mediaStream;
    startCallBtnEl.setAttribute("disabled", true);
    stopCallBtnEl.removeAttribute("disabled");
    setCanvas(remoteCanvasEl, remoteVideoEl, true);

    // let remote user know what canvas filter we're using
    sendMessage({
      messageType: "CANVAS_FILTER",
      message: filterOptionsSelectEl.value,
    });
    sendNotification("connected");
  }
};

// lesson 4; updated 4.5.3
const stopCall = () => {
  closeConnection();
  remoteStream = null;
  remoteVideoEl.srcObject.getTracks().forEach((track) => track.stop());
  startCallBtnEl.removeAttribute("disabled");
  stopCallBtnEl.setAttribute("disabled", true);
  remoteVideoEl.classList.remove("hidden");
  remoteCanvasEl.classList.add("hidden");
  sendNotification("stopped");
};

// lesson 4
const handleStopCall = () => {
  stopCall();
  sendMessage({ messageType: "HANG_UP", message: "" });
};

// lesson 4
startCallBtnEl.addEventListener("click", handleStartCall);
stopCallBtnEl.addEventListener("click", handleStopCall);

// lesson 2
filterOptionsSelectEl.addEventListener("change", handleSelectChange);

// lesson 1
clipboardBtn.addEventListener("click", copyToClipboard);

renderFilterOptions(filterOptionsSelectEl);
initializeVideoChat();
// added 4.5.3
getNotificationPermission();
