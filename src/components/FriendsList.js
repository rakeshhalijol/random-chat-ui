import React, { useEffect, useState } from "react";
import styles from "@/styles/FriendList.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
const FriendsList = (props) => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const handleChat = (reciver) => {
    router.push(`/dashboard/chat?sender=${props.name}&reciver=${reciver}`);
  };
  const handleFollow = (friend) => {
    console.log("Hello");
  };
  useEffect(() => {
    let url = "http://13.50.250.177/random-chat/friends?name=" + props.name;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json.users);
        setData(json.users);
      })
      .catch((error) => console.error(error));
  }, [props.name]);
  return (
    <div className={styles.container}>
      {data.map((item, index) => (
        <div className={styles.usercard} key={index}>
          <Image
            className={styles.profile}
            src="/default.png"
            width={40}
            height={40}
          />
          <p>{item.name}</p>
          <div>
            <button
              className={styles.msg}
              onClick={() => handleChat(item.name)}
            >
              message
            </button>
            <button
              onClick={() => handleFollow(item.name)}
              className={styles.follow}
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
