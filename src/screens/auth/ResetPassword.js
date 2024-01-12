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
import { Encrypt,Decrypt } from "../../common/KMS";


export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let user = localStorage.getItem("resetpassworduserdata") ? JSON.parse(localStorage.getItem("resetpassworduserdata")) : {};

  async function ResetPassword(){
    if(password == null || password.toString() == "" || confirmPassword == null || confirmPassword.toString() == ""){
        alert("password fields are mandatory");
        return;
    }else if(password.toUpperCase().toString() != confirmPassword.toString().toUpperCase()){
        alert("Password and confirm password does not match");
        return;
    }else{
        try{
            setLoading(true);
            let passwordDetails = `${password}`;
            await Encrypt(passwordDetails).then(async (encryptedData)=>{
                let reqdata = {
                    userid : user.id,
                    password : oldpassword,
                    newpassword : encryptedData,
                    confirmpassword : confirmPassword,
                    createdby : user.id,
                    guid : null,
                    passwordDetails : passwordDetails
                }
                const resp = await fetch(`${APIEndPoint}/users/forgetpasswordmobile`, {
                method: 'PUT',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    }),
                body: JSON.stringify(reqdata)
                });
                const responce = await resp.json();
                alert(responce.message);
                if(responce.status)
                    navigation.navigate("Login");
            })
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
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
              Reset Password
            </Text>
            <Text>Old Password</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder="Enter your old password"
              value={oldpassword}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setOldPassword(text)}
            />
            <Text>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setPassword(text)}
            />
            <Text>Confirm Password</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder="Confirm password"
              value={confirmPassword}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Button
              text={loading ? "Loading..." : "Reset Password"}
              onPress={() => {
                ResetPassword();
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
