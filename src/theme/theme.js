import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            primary: "#FD856C",
            secondary: "#FC7753",
            border: "#CCCCCC",
            borderHover: "#AAAAAA",
            focus: "#FD856C",
            error: "#E57373",
            background: "#f5f5f5",
            text: "#1a1a1a",
            menuBg: "#FFFFFF",
            menuHover: "#F5F5F5"
        },
    },
    styles: {
        global: {
            "html, body": {
                backgroundColor: "brand.background",
                color: "brand.text",
                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
                margin: 0,
                padding: 0,
                minHeight: "100vh",
            },
            a: {
                color: "brand.primary",
                textDecoration: "none",
                fontWeight: 500,
                _hover: {
                    color: "brand.secondary",
                },
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.2s",
            },
            variants: {
                solid: {
                    bg: "brand.primary",
                    color: "white",
                    _hover: {
                        bg: "brand.secondary",
                        transform: "translateY(-1px)",
                    },
                    _active: {
                        transform: "translateY(0)",
                    }
                },
                outline: {
                    border: "2px solid",
                    borderColor: "brand.primary",
                    color: "brand.primary",
                    _hover: {
                        bg: "brand.primary",
                        color: "white",
                    },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Input: {
            variants: {
                outline: {
                    field: {
                        borderRadius: "8px",
                        borderWidth: "1px",
                        borderColor: "brand.border",
                        transition: "all 0.2s",
                        _hover: {
                            borderColor: "brand.borderHover",
                        },
                        _focus: {
                            borderColor: "brand.focus",
                            boxShadow: "0 0 0 1px var(--chakra-colors-brand-focus)",
                        },
                        _invalid: {
                            borderColor: "brand.error",
                            boxShadow: "0 0 0 1px var(--chakra-colors-brand-error)",
                        },
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },
        Textarea: {
            variants: {
                outline: {
                    borderRadius: "8px",
                    borderWidth: "1px",
                    borderColor: "brand.border",
                    transition: "all 0.2s",
                    _hover: {
                        borderColor: "brand.borderHover",
                    },
                    _focus: {
                        borderColor: "brand.focus",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-focus)",
                    },
                    _invalid: {
                        borderColor: "brand.error",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-error)",
                    },
                },
            },
            defaultProps: {
                variant: "outline",
            },
        },
        Switch: {
            baseStyle: {
                track: {
                    bg: "brand.border",
                    _checked: {
                        bg: "brand.primary",
                    },
                },
                thumb: {
                    bg: "white",
                },
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    bg: "brand.menuBg",
                    borderRadius: "8px",
                    boxShadow: "lg",
                },
                item: {
                    bg: "transparent",
                    _hover: {
                        bg: "brand.menuHover",
                    },
                    _focus: {
                        bg: "brand.menuHover",
                    },
                },
            },
        },
    },
});

export default theme;