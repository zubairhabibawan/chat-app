import React, { useEffect } from "react";
import type { RootState } from "../../store";
import { fetchChatData, updateProcessedChatData } from "./ChatSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";
interface ChatData {
  chatId: string;
  lastMessage: LastMessage;
  title: string;
  members: object[];
  firstname: string;
  type: string;
}

interface LastMessage {
  sender: Sender;
  message: string;
  dateCreated: string;
}
interface Sender {
  firstname: string;
}
interface SortParam{
  timeToSort : string
}
export function Chat() {
  const chatData = useAppSelector((state: RootState) => state.chatData);
  const dispatch = useAppDispatch();
  
  const modifyChatData = () => {
    let modifiedData:object[] = chatData.chatsForOrganization.map((chat: ChatData) => {
      return {
        id: chat.chatId,
        image: getProfileIcon(chat.type),
        title: chat.title ? chat.title : getTitle(chat.members),
        lastMessageContent: getLastMessageContent(chat.lastMessage),
        timeToSort: chat.lastMessage.dateCreated,
        timeToDisplay: getTimeToDisplay(chat.lastMessage.dateCreated),
        isActive: false,
        type: chat.type,
      };
    });
    modifiedData.sort((a:SortParam, b:SortParam) => {
      const dateA = Date.parse(a.timeToSort);
      const dateB = Date.parse(b.timeToSort);
      return dateA - dateB;
    });
    dispatch(updateProcessedChatData(modifiedData));
  };
  const getProfileIcon = (type: string) => {
    if (type === "group") {
      return "https://cdn-icons-png.flaticon.com/512/9790/9790561.png";
    } else if (type === "single") {
      return "https://cdn-icons-png.flaticon.com/512/2202/2202112.png";
    } else {
      return "https://cdn-icons-png.flaticon.com/512/2202/2202112.png";
    }
  };
  const getTimeToDisplay = (date: string) => {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const timeDiff = currentDate.getTime() - givenDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const twoDays = 2 * oneDay; // One day in milliseconds
    const oneYear = 365 * oneDay; // One year in milliseconds

    if (timeDiff === 0) {
      return givenDate.toLocaleTimeString(); // Same day, show time
    } else if (timeDiff >= oneDay && timeDiff < twoDays) {
      return "Yesterday"; // One day difference, show "Yesterday"
    } else if (timeDiff >= oneYear) {
      return givenDate.toLocaleDateString(); // More than one year difference, show date like "YYYY-MM-DD"
    } else {
      return givenDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }); // More than one day but less than a year difference, show date like "Month Day"
    }
  };
  const getLastMessageContent = (lastMessage: LastMessage) => {
    return lastMessage.sender.firstname + ":" + lastMessage.message;
  };
  const getTitle = (members: object[]) => {
    let titleString: string = "";
    let titleMaxLength: number = 25;
    let remainingPeople: number = members.length;
    members.forEach((member: ChatData, index) => {
      let currentNameLength: number = member.firstname.length;
      let titleStringLength: number = titleString.length;
      if (currentNameLength + titleStringLength <= titleMaxLength) {
        if (index !== 0) {
          titleString += ",";
        }
        titleString += member.firstname;
        remainingPeople--;
      }
    });
    if (remainingPeople > 0) {
      titleString += " +" + remainingPeople + " People";
    }
    return titleString;
  };
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timerId: NodeJS.Timeout;
  
    return function (...args: any[]) {
      clearTimeout(timerId);
      timerId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  const debouncedModifyChatData = debounce(modifyChatData, 500);
  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);
  useEffect(() => {
    if (chatData.chatsForOrganization.length > 0) {
      debouncedModifyChatData();
    }
  }, [chatData.chatsForOrganization]);
  return (
    <div className={"chat-parent"}>
      <div className={"left-section-parent w-25"}>
        <LeftSection />
      </div>
      <div className={"right-section-parent w-75"}>
        <RightSection />
      </div>
    </div>
  );
}
