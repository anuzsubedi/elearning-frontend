import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false, // Force light mode globally
    },
    styles: {
        global: {
            "html, body": {
                backgroundColor: "#f8f8f8",
                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
                color: "#1a1a1a",
                margin: 0,
                padding: 0,
                minHeight: "100vh",
            },
            a: {
                color: "#FD856C",
                textDecoration: "none",
                fontWeight: 500,
                _hover: {
                    color: "#FC7753",
                },
            },
        },
    },
    colors: {
        brand: {
            primary: "#FD856C",
            hover: "#FC7753",
            border: "#E0E0E0",
            focus: "#FD856C",
            inputHover: "#FFAA94",
            error: "#E57373",
            menuBg: "#FFFFFF",
            menuHover: "#F8F8F8",
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: "999px",
                fontWeight: "bold",
            },
            variants: {
                solid: {
                    bg: "brand.primary",
                    color: "white",
                    _hover: { bg: "brand.hover" },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Input: {
            baseStyle: {
                field: {
                    borderRadius: "8px",
                    border: "2px solid",
                    borderColor: "brand.border",
                    _hover: {
                        borderColor: "brand.inputHover",
                    },
                    _focus: {
                        borderColor: "brand.focus",
                        boxShadow: "0 0 0 2px brand.focus",
                    },
                },
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    bg: "brand.menuBg",
                    border: "none",
                    boxShadow: "none",
                },
                item: {
                    bg: "brand.menuBg",
                    color: "#1a1a1a",
                    px: 4,
                    py: 2,
                    _hover: {
                        bg: "brand.menuHover",
                    },
                },
            },
        },
    },
});

export default theme;
