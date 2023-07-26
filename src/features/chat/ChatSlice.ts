import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatDataStates {
  chatsForOrganization: object[];
  processedChatData: object[];
  rightSectionTitle: string;
}

interface MyData {
  data: object;
}
interface SingleChat {
  isActive: boolean;
  title: string;
}

const initialState: ChatDataStates = {
  processedChatData: [],
  chatsForOrganization: [],
  rightSectionTitle:''
};

export const fetchChatData = createAsyncThunk(
  "fetchAllChats",
  // Declare the type your function argument here:
  async () => {
    const response = await fetch(
      "https://api.staging.hypercare.com/graphql/private",
      {
        method: "POST",
        headers: {
          "hypercare-scope": "eyJvcmdhbml6YXRpb25JZCI6MX0='",
          "Content-Type": "application/json",
          Authorization: "Bearer 3a1aeb259e5987a8be639d05714cc1dd2f87ff15",
        },
        body: JSON.stringify({
          query: `query organizationChats($continuationId: ID, $limit: Int, $isPriority: Boolean) {
                              chatsForOrganization(continuationId: $continuationId, limit: $limit, isPriority: $isPriority) {
                                chats {
                                  ...basicChatFields
                                  unreadPriorityMessages
                                }
                              }
                            }
                            
                            fragment basicChatFields on Chat {
                              chatId: id
                              title
                              type
                              members {
                                ...chatMemberFields
                              }
                              lastMessage {
                                ...messageFields
                              }
                              muted
                              status
                              dateCreated
                              isArchived
                              unreadPriorityMessages
                            }
                            
                            fragment chatMemberFields on ChatMember {
                              id
                              firstname
                              lastname
                              username
                              role
                              profilePic {
                                url
                              }
                              status
                              privilege
                              workStatus
                              statusExpiryDate
                              statusDescription
                              workStatusProxy {
                                ...publicUserStatusFields
                              }
                            }
                            
                            fragment messageFields on Message {
                              id
                              priority
                              message
                              image
                              # attachment {
                              # url
                              # mimeType
                              # fileName
                              # }
                              type
                              dateCreated
                              sender {
                                ...publicUserFields
                              }
                              readBy {
                                ...readReceiptFields
                              }
                              data {
                                __typename
                                ... on ConsultMessageData {
                                  mrn
                                  firstname
                                  lastname
                                  details
                                }
                              }
                            }
                            
                            fragment readReceiptFields on ReadReceipt {
                              messageId
                              user {
                                ...publicUserFields
                              }
                              timestamp
                            }
                            
                            fragment publicUserFields on PublicUser {
                              id
                              firstname
                              lastname
                              username
                              role
                              profilePic {
                                url
                              }
                              workStatus
                              statusDescription
                              workStatusProxy {
                                ...publicUserStatusFields
                              }
                            }
                            
                            fragment publicUserStatusFields on PublicUser {
                              id
                              firstname
                              lastname
                              username
                              role
                              profilePic {
                                url
                              }
                            }`,
          variables: {
            isPriority: false,
            limit: 20,
          },
        }),
      }
    );
    return (await response.json()) as MyData;
  }
);

export const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  extraReducers: {
    "fetchAllChats/fulfilled": (state, thunkApi) => {
      state.chatsForOrganization =
        thunkApi.payload.data.chatsForOrganization.chats;
      console.log("fulfilled", thunkApi);
    },
    "fetchAllChats/pending": (thunkApi) => {
      console.log("pending", thunkApi);
    },
    "fetchAllChats/rejected": (thunkApi) => {
      console.log("rejected", thunkApi);
    },
  },
  reducers: {
    updateProcessedChatData: (state, action: PayloadAction<object[]>) => {
      state.processedChatData = action.payload;
    },
    updateChatStatus: (state, action: PayloadAction<number>) => {
      state.processedChatData.forEach((chat: SingleChat, index: number) => {
        chat.isActive = false;
        if (action.payload === index) {
          chat.isActive = true;
          state.rightSectionTitle = chat.title
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProcessedChatData, updateChatStatus } = chatSlice.actions;

export default chatSlice.reducer;
