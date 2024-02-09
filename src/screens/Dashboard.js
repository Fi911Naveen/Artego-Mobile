import React ,{useContext} from "react";
import { View } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../provider/AuthProvider";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = useContext(AuthContext);

  return (
    <Layout>
      <TopNav
        middleContent="Dashboard" 
        // leftContent={
        //   <Ionicons
        //     name={isDarkmode ? "sunny" : "moon"}
        //     size={20}
        //     color={isDarkmode ? themeColor.white100 : themeColor.dark}
        //   />
        // }
        // leftAction={() => {
        //   if (isDarkmode) {
        //     setTheme("light");
        //   } else {
        //     setTheme("dark");
        //   }
        // }}
        rightContent={
          <Ionicons
            name="log-out-outline"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          let responce = confirm("are you sure you want to logout?");
          if(responce)
            auth.assignUser(false);
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text fontWeight="bold">Welcome</Text>
      </View>
    </Layout>
  );
}
