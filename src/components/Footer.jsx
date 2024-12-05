import React from "react";
import {
    Box,
    Flex,
    Text,
    Link,
    VStack,
    HStack,
    Input,
    Button,
    IconButton,
    Divider,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <Box bg="brand.primary" color="white" py={10} px={6}>
            <Flex
                maxW="1200px"
                mx="auto"
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="start"
                wrap="wrap"
            >
                <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                        NextAcademy
                    </Text>
                    <Text>Empowering the next generation of learners.</Text>
                    <HStack spacing={4}>
                        <IconButton
                            as="a"
                            href="#"
                            aria-label="Facebook"
                            icon={<FaFacebook />}
                            bg="white"
                            color="brand.primary"
                            _hover={{ bg: "gray.200" }}
                        />
                        <IconButton
                            as="a"
                            href="#"
                            aria-label="Twitter"
                            icon={<FaTwitter />}
                            bg="white"
                            color="brand.primary"
                            _hover={{ bg: "gray.200" }}
                        />
                        <IconButton
                            as="a"
                            href="#"
                            aria-label="Instagram"
                            icon={<FaInstagram />}
                            bg="white"
                            color="brand.primary"
                            _hover={{ bg: "gray.200" }}
                        />
                        <IconButton
                            as="a"
                            href="#"
                            aria-label="LinkedIn"
                            icon={<FaLinkedin />}
                            bg="white"
                            color="brand.primary"
                            _hover={{ bg: "gray.200" }}
                        />
                    </HStack>
                </VStack>
                <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
                    <Text fontSize="lg" fontWeight="bold">Quick Links</Text>
                    <Link href="#">Home</Link>
                    <Link href="#">Courses</Link>
                    <Link href="#">About Us</Link>
                    <Link href="#">Contact</Link>
                </VStack>
                <VStack align="start" spacing={4} mb={{ base: 8, md: 0 }}>
                    <Text fontSize="lg" fontWeight="bold">Resources</Text>
                    <Link href="#">Blog</Link>
                    <Link href="#">Help Center</Link>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                </VStack>
                <VStack align="start" spacing={4}>
                    <Text fontSize="lg" fontWeight="bold">Subscribe to our newsletter</Text>
                    <Text>Get the latest updates and offers.</Text>
                    <HStack as="form" spacing={0} w="100%">
                        <Input
                            placeholder="Enter your email"
                            borderRightRadius={0}
                            bg="white"
                            color="black"
                            _focus={{ borderColor: "brand.focus" }}
                        />
                        <Button
                            type="submit"
                            bg="white"
                            color="brand.primary"
                            borderLeftRadius={0}
                            _hover={{ bg: "gray.200" }}
                        >
                            Subscribe
                        </Button>
                    </HStack>
                </VStack>
            </Flex>
            <Divider my={6} />
            <Flex
                maxW="1200px"
                mx="auto"
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
                wrap="wrap"
            >
                <Text>&copy; {new Date().getFullYear()} NextAcademy. All rights reserved.</Text>
                <HStack spacing={4}>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                </HStack>
            </Flex>
        </Box>
    );
};

export default Footer;