import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Header from "../components/Header";

const TeacherHome = () => (

    <Box textAlign="center" py={10} px={6}>
        <Header />
        <Heading as="h1" size="xl">
            Teacher Home
        </Heading>
    </Box>
);

export default TeacherHome;
