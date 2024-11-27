import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import bookImage from "../assets/book.png";
const TeacherHome = () => (
    <Box textAlign="center" py={10} px={6}>
        <Header />
        <Banner
            header="Start Teaching Today!"
            description="Impart your knowledge and inspire the next generation. Share your expertise, create impactful lessons, and shape future innovators!"
            image={bookImage}
        />
    </Box>
);

export default TeacherHome;
