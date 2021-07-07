import "../../css/style.scss";

const roomIdEl = document.querySelector("#room-id");

let roomId = null;

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

const getRoomId = () => {
  const params = getQueryStringParams(document.location.search);
  roomId = params.roomId;
  roomIdEl.textContent = roomId;
  return params.roomId;
};

getRoomID();
