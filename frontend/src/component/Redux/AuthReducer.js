const userDatastring = localStorage.getItem("user");
const initialState = {
  NotiCount: localStorage.getItem("previousNotificationCount") || 0,
  userData: userDatastring ? JSON.parse(JSON.stringify(userDatastring)) : {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Send_CountSUCCESS":
      localStorage.setItem("previousNotificationCount", action.payload);

      return {
        ...state,
        NotiCount: action.payload,
      };
    case "Send_UserData":
      localStorage.setItem("user", JSON.stringify(action.payload));

      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
