import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import styles from "@/styles/chat.module.css";
import Image from "next/image";
import Head from "next/head";
const chat = () => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [image, setImage] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let ws = new WebSocket(
      `ws://13.50.250.177/ws/${router.query.sender}/${router.query.reciver}`
    );
    setSocket(ws);
    ws.addEventListener("message", (e) => {
      console.log(JSON.parse(e.data));
      setChatData([...chatData, JSON.parse(e.data)]);
    });
    ws.addEventListener("open", (e) => {
      console.log("open");
    });
    ws.addEventListener("error", (e) => {
      console.log("error" + e);
    });
    return () => {
      ws.close();
    };
  }, [chatData]);

  const sendMsg = () => {
    if (image != null && msg !== "") {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let data = JSON.stringify({
          param: ["text", "image"],
          sender: router.query.sender,
          reciver: router.query.reciver,
          msg: msg,
          imageData: reader.result,
        });
        socket.send(data);
      });

      reader.readAsDataURL(image);
    } else if (msg !== "" && image == null) {
      let data = JSON.stringify({
        param: ["text"],
        sender: router.query.sender,
        reciver: router.query.reciver,
        msg: msg,
        imageData: null,
      });
      socket.send(data);
    } else if (msg === "" && image !== null) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let data = JSON.stringify({
          param: ["image"],
          sender: router.query.sender,
          reciver: router.query.reciver,
          imageData: reader.result,
        });
        socket.send(data);
      });

      reader.readAsDataURL(image);
    }
    setMsg("");
    setImage(null);
  };

  const displayData = (cssclass, idx, params, imgData, textData) => {
    if (params.includes("text") && params.includes("image")) {
      return (
        <div className={cssclass} key={idx}>
          <Image src={imgData} width={200} height={200} />
          <p>{textData}</p>
        </div>
      );
    } else if (params.includes("text")) {
      return (
        <div className={cssclass} key={idx}>
          <p>{textData}</p>
        </div>
      );
    } else if (params.includes("image")) {
      return (
        <div className={cssclass} key={idx}>
          <Head>
            <title>Chat</title>
          </Head>
          <Image src={imgData} width={200} height={200} />
        </div>
      );
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.sendTools}>
        <textarea
          className={styles.typingSpace}
          cols={50}
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button className={styles.sendButton} onClick={sendMsg}>
          send
        </button>
      </div>

      <div className={styles.chatbox}>
        {chatData.map((item, idx) => (
          <>
            {item.sender === router.query.sender
              ? displayData(
                  styles.sender,
                  idx,
                  item.param,
                  item.imageData,
                  item.msg
                )
              : displayData(
                  styles.reciver,
                  idx,
                  item.param,
                  item.imageData,
                  item.msg
                )}
          </>
        ))}
      </div>
    </div>
  );
};
export default chat;
