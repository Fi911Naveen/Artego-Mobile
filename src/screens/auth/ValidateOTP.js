import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { APIEndPoint } from "../../../envirnment";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  let user = localStorage.getItem("resetpassworduserdata") ? JSON.parse(localStorage.getItem("resetpassworduserdata")) : {};

  async function ValidateOTP(){
    console.log("user",user)
    if(!otp){
      alert("otp is mandatory");
      return;
    }
    setLoading(true);
    let reqdata = {
      username : user ? user.email : null,
      passcode : otp
    }
    const resp = await fetch(`${APIEndPoint}/validateforgotpasswordotp`, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }),
      body: JSON.stringify(reqdata)
    });
    const responce = await resp.json();
    console.log(responce);
    if(responce.status){
      navigation.navigate("ResetPassword")
    }else{
      alert(responce.message)
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/forget.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              size="h3"
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              require
            >
              OTP Validation
            </Text>
            <Text>Enter OTP</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder="Enter your passcode"
              value={otp}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(text) => setOTP(text)}
            />
            <Button
              text={loading ? "Validating..." : "Validate OTP"}
              onPress={() => {
                ValidateOTP();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
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
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
