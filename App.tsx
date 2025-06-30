import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import ChatScreen from "./src/screens/ChatScreen";

export default function App() {
  return (
    <Provider store={store}>
      <ChatScreen />
    </Provider>
  );
}
