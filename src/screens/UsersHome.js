import React ,{useContext} from "react";
import { View, Linking } from "react-native";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../provider/AuthProvider";
// import TopNavCustom from "./headings/TopNav";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = useContext(AuthContext);

  return (
    <Layout>
      <TopNav
        middleContent="Users Home" 
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
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
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Welcome to Users section
            </Text>
            <Button
              text="All Users"
              status="warning"
              onPress={() => {
                navigation.navigate("AllUsers");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Create User"
              status="warning"
              onPress={() => {
                navigation.navigate("NewUser");
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
