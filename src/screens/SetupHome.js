import React ,{useContext, useEffect} from "react";
import {
    ScrollView,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Image,
  } from "react-native";
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

  useEffect(() => {
    if(!localStorage.getItem('userToken')){
      auth.assignUser(false);
      return;
    }
  }, []);

  return (
    <Layout>
      <TopNav
        middleContent="Setup" 
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
              Welcome to Setup section
            </Text>
            <Button
              text="My Profile"
              status="warning"
              onPress={() => {
                navigation.navigate("MyProfile");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Admin-Users"
              status="warning"
              onPress={() => {
                navigation.navigate("UsersHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Change Password"
              status="warning"
              onPress={() => {
                navigation.navigate("ChangePassword");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Settings"
              status="warning"
              onPress={() => {
                navigation.navigate("UsersHome");
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
        <View
            style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            justifyContent: "center",
            }}
        >
            <TouchableOpacity
            onPress={() => {
                isDarkmode ? setTheme("light") : setTheme("dark");
            }}
            >
            <Text
                size="md"
                fontWeight="bold"
                style={{
                marginLeft: 5,
                }}
            >
                {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
            </Text>
            </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
