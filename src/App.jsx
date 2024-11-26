import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import { Box, Flex } from "@chakra-ui/react";

const App = () => (
  <>
    <Header />
    <Flex
      as="main"
      maxW="80%"
      mx="auto"
      align="center"
      justify="center"
      minH="100vh"
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Flex>
  </>
);

export default App;
