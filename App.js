import React from "react";
import { View, StyleSheet } from "react-native";
import Routes from "./navigation";
import Home from "./screens/Home";
import PostStation from "./screens/PostStation";
import SubscribeStation from "./screens/SubscribeStation";

export default function App() {
  return <Routes />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
  },
});
