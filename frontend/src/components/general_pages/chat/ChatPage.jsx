import { useEffect, useRef, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import YourMessage from "./YourMessage";
import MyMessage from "./MyMessage";

const ChatPage = () => {
  const loaderData = useRouteLoaderData("root");
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [, setReceivedMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const location = useLocation();
  const containerRef = useRef(null);
  const path = location.pathname.split("/");
  const recipientId = path[path.length - 1];
  const senderId = loaderData?.decodedToken.email;
  const limit = 25;

  // * THIS IS FOR WEBSOCKET
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      reconnectionDelay: 100000,
      auth: {
        token: "123",
      },
      query: {
        "my-key": "my-value",
      },
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
        auth: loaderData?.token,
      },
    });
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
    });
    newSocket.on("message", (data) => {
      const parsedData = JSON.parse(data);
      const newReceivedMsg = {
        content: parsedData?.content,
        senderId: parsedData?.senderId,
        time: parsedData?.time,
        type: "message",
      };
      setAllMessages((oldMsg) => [newReceivedMsg, ...oldMsg]);

      setReceivedMessage(data);
    });
    newSocket.on("disconnect", () => {
      setConnected(false);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", () => {
      handleScroll();
    });
    return () =>
      container.removeEventListener("scroll", () => {
        handleScroll();
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchInitialMessages();
    };
    fetchData();
  }, [pageNumber]);

  const fetchInitialMessages = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_URL}/messages/${recipientId}/?page=${pageNumber}&limit=${limit}`,
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios.request(config);
      if (response?.status === 200)
        setAllMessages((oldMsg) => [...oldMsg, ...response.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    // console.log(
    //   container.scrollHeight,
    //   container.scrollTop,
    //   container.clientHeight,
    // );
    if (
      container.scrollHeight + container.scrollTop - 10 <=
      container.clientHeight
    ) {
      // console.log(pageNumber);
      setPageNumber((prev) => prev + 1);
    }
  };

  // * THIS IS FOR SEND MESSAGES VIA WEBSOCKET
  const sendMessageHandler = (event) => {
    event.preventDefault();
    if (message) {
      if (socket) {
        socket.emit("message", {
          senderId,
          recipientId,
          content: message,
          type: "message",
        });
      }
      const newMsg = {
        content: message,
        senderId,
        time: Date.now(),
        type: "message",
      };

      setAllMessages((oldMsg) => [newMsg, ...oldMsg]);

      setMessage("");
    }
  };

  return (
    <>
      <div className=" chat-container">
        <div className="relative w-[100%] h-[100%]">
          <div className="bg-gray-200 p-2 uppercase font-bold text-center">
            {recipientId}
          </div>
          <form
            onSubmit={sendMessageHandler}
            className=" w-full absolute bottom-0 left-15"
          >
            <div className=" h-12 w-full flex">
              <input
                placeholder="Write your message here."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={`bg-gray-100 border-[2px] ${connected ? "border-black" : "border-red-500"} w-full m-1 p-2 h-full rounded-xl`}
                disabled={!connected}
              />
              <button
                className={`m-1 h-full ${connected ? "bg-[#1976d2]" : "bg-gray-700"}`}
                disabled={!connected}
              >
                <SendIcon style={{ color: "white" }} />
              </button>
            </div>
          </form>
          <div
            id="test"
            ref={containerRef}
            className="h-[85%] overflow-y-auto overflow-x-hidden flex flex-col-reverse"
          >
            {allMessages.map((msg) => {
              return (
                <div key={msg.time}>
                  {msg.senderId === senderId ? (
                    <MyMessage
                      person={msg.senderId}
                      content={msg.content}
                      time={msg.time}
                    />
                  ) : (
                    <YourMessage
                      person={msg.senderId}
                      content={msg.content}
                      time={msg.time}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
