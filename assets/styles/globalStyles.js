import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        maxWidth: "75%",
        textAlign: "center",
        color: colors.primary,
    },
    subTitle: {
        fontSize: 28,
        fontWeight: "bold",
        maxWidth: "75%",
        textAlign: "center",
        color: colors.primary,
    },
    bt: {
        width: 130,
        height: 45,
        backgroundColor: colors.primary,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    in_bt: {
        color: "white",
        // margin: 10,
        // width: "40%",
        textAlign: "center",
    },
    text_input: {
        borderBottomWidth: 1,
        borderColor: "gray",
        margin: 2,
        padding: 5,
        width: "80%",
    },
    flex_container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    checkbox: {
        alignSelf: "center",
    },
    checkbox_label: {
        margin: 10,
    },
    mini_card: {
        flexDirection: "row",
        width: 300,

        opacity: 0.8,
        elevation: 10,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
    },
    mini_card_image_style: { width: 200, height: 100, alignItems: "center" },

    maxi_card_style: {
        flex:1,
        marginHorizontal: 10,
        alignItems: "center",
        backgroundColor:"white",
        width:300,
        elevation:10,
    },
});
