import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false, // Force light mode globally
    },
    styles: {
        global: {
            "html, body": {
                backgroundColor: "#f5f5f5",
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
            "*, *::before, *::after": {
                boxSizing: "border-box", // Consistent box-sizing
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
            switchTrack: "#FD856C", // Custom color for Switch track
            switchThumb: "#FFFFFF", // Custom color for Switch thumb
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
                    border: "10px solid",
                    borderColor: "#FF0000",
                    _hover: {
                        borderColor: "brand.inputHover",
                    },
                    _focus: {
                        borderColor: "brand.focus",
                        boxShadow: "0 0 0 2px brand.focus",
                    },
                    _invalid: {
                        borderColor: "brand.error",
                        boxShadow: "0 0 0 2px brand.error",
                    },
                },
            },
        },
        Switch: {
            baseStyle: {
                track: {
                    bg: "brand.border",
                    _checked: {
                        bg: "brand.switchTrack", // Ensure proper rendering in Firefox
                    },
                },
                thumb: {
                    bg: "brand.switchThumb", // Consistent thumb color
                    borderWidth: "2px",
                    borderColor: "brand.border",
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
