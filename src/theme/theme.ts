import { extendTheme } from "@chakra-ui/react";

export const defaultThem = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  fonts: {
    body: "Poppins, sans-serif, Inter",
    heading: "Poppins, sans-serif, Inter",
  },
  styles: {
    global: {
      a: {
        textDecoration: "underline",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          outline: "none",
        },
        borderRadius: "3px",
        fontWeight: "400",
      },
    },
    Link: {
      baseStyle: {
        textDecoration: "underline",
        _hover: {
          color: "gray.300",
        },
      },
    },
  },
  colors: {
    secondary: {
      100: "#FFE28A",
      200: "#FFD55F",
      300: "#FFC933",
      400: "#FFBD0D",
      500: "#FFB300",
      600: "#FFA600",
      700: "#FF9A00",
      800: "#FF8E00",
      900: "#FF8100",
    },
    primary: {
      100: "#89CFF0",
      200: "#5EB8E5",
      300: "#33A1DA",
      400: "#0D8ACF",
      500: "#0073C4",
      600: "#0066B3",
      700: "#0059A2",
      800: "#004C91",
      900: "#003F80",
    },
  },
  shadows: {
    outline: "none",
  },
});
