import React ,{useContext, useEffect, useState} from "react";
import { View, Linking, ActivityIndicator, FlatList, Image, ScrollView } from "react-native";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
  TextInput
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import querystring from 'querystring';
import { AuthContext } from "../../provider/AuthProvider";
import { Encrypt } from "../../common/KMS";
import { APIEndPoint } from "../../../envirnment";

export default function ChangePassword() {
  const { isDarkmode, setTheme } = useTheme();
  let navigation = useNavigation();
  const auth = useContext(AuthContext);
  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  let user :any = localStorage.getItem("userinfo") || {};

  useEffect(() => {
    if(!localStorage.getItem('userToken')){
      auth.assignUser(false);
      return;
    }
  }, []);

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
                // if(responce.status)
                    // navigation.navigate("Login");
            })
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
  }

  return (
    <Layout >
      <TopNav
        middleContent="Change Password" 
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
      <Section style={{ marginTop: 20 }}>
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
          <SectionContent>
            {/* <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Welcome to Setup section
            </Text> */}
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              
              <Text>Old Password</Text>
              <TextInput
                containerStyle={{ marginTop: 5,marginBottom:5 }}
                placeholder="Enter your old password"
                value={oldpassword}
                autoCapitalize="none"
                // autoCompleteType="off"
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
                // autoCompleteType="off"
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
                // autoCompleteType="off"
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
            </ScrollView>
          </SectionContent>
        </Section>
    </Layout>
  );
}
