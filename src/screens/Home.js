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
        middleContent="Merchants" 
        leftContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
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
              Welcome to Merchant section
            </Text>
            <Button
              text="Proposals"
              status="warning"
              onPress={() => {
                navigation.navigate("Proposals");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Create Proposal"
              status="warning"
              onPress={() => {
                navigation.navigate("NewProposals");
              }}
              style={{
                marginTop: 10,
              }}
            />
            {/* <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            /> */}
            {/* <Button
              text="Go to second screen"
              status="success"
              onPress={() => {
                navigation.navigate("SecondScreen");
              }}
              style={{
                marginTop: 10,
              }}
            /> */}
            {/* <Button
              status="danger"
              text="Logout"
              onPress={() => {
                auth.assignUser(false);
              }}
              style={{
                marginTop: 10,
              }}
            /> */}
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
