import React ,{useContext, useEffect, useState} from "react";
import { View, Linking, TextInput, ActivityIndicator, FlatList, Image } from "react-native";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import querystring from 'querystring';
import { AuthContext } from "../../provider/AuthProvider";

export default function MyProfile() {
  const { isDarkmode, setTheme } = useTheme();
  let navigation = useNavigation();
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
        middleContent="My Profile" 
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
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
        <Text fontWeight="bold">Coming soon</Text>
      </View>
    </Layout>
  );
}
