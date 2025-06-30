import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useChatCompletionMutation } from "../api/openaiApi";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatCompletion, { isLoading }] = useChatCompletionMutation();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const { assistant } = await chatCompletion({
        message: userMsg.content,
      }).unwrap();
      const assistantMsg: ChatMessage = {
        id: Date.now().toString() + "-a",
        role: "assistant",
        content: assistant,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: Date.now().toString() + "-e",
        role: "assistant",
        content: "⚠️ Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.bubble,
        item.role === "user" ? styles.user : styles.assistant,
      ]}
    >
      <Text style={styles.text}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        inverted
      />

      {isLoading && (
        <ActivityIndicator size="small" style={{ paddingVertical: 4 }} />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message…"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          editable={!isLoading}
        />
        <Button title="Send" onPress={sendMessage} disabled={isLoading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 12, flexGrow: 1, justifyContent: "flex-end" },
  bubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: "80%",
  },
  user: { backgroundColor: "#d1e7dd", alignSelf: "flex-end" },
  assistant: { backgroundColor: "#e9ecef", alignSelf: "flex-start" },
  text: { fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#dee2e6",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    padding: 10,
    marginRight: 6,
    fontSize: 16,
  },
});
