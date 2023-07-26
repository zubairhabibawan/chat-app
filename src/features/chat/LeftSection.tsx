import type { RootState } from "../../store";
import { useAppSelector , useAppDispatch } from "../../hooks";
import { updateChatStatus } from "./ChatSlice";
interface Chat {
  image: string;
  isActive: boolean;
  lastMessageContent: string;
  timeToDesplay: string;
  title: string;
}
export function LeftSection() {
  const dispatch = useAppDispatch();
  const chatData = useAppSelector((state: RootState) => state.chatData);
  const updateActiveChat = (index:number)=> (event: React.MouseEvent<HTMLDivElement>) =>{
       dispatch(updateChatStatus(index));
  }
  return (
    <div className={"left-section-container"}>
      <div className={"left-section-heading"}>Messaging</div>
      <div className="left-section-scroll-div">
      {chatData.processedChatData.map((item:Chat, index) => (
        <div key={index} className={`normal-message-list-wrapper  ${item.isActive ? 'active' : ''}`} onClick={updateActiveChat(index)}>
          <div className={"left-section-content-wrapper"}>
            <div className={"icon"}>
              <img className="img" src={item.image} alt={"https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} />
            </div>
            <div className={"content"}>
              <div className="message-title">{item.title}</div>
              <div className="message-content">{item.lastMessageContent}</div>
            </div>
          </div>
          <div className={"time-header"}>
            <span>{item.timeToDesplay}</span>
          </div>
        </div>
      ))}
      </div>
      
    </div>
  );
}
