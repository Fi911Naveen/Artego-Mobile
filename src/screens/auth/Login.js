import React, { useContext, useState } from "react";
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
import { KMS } from 'aws-sdk';
import querystring from 'querystring';
import {Buffer} from 'buffer';
import { AuthContext  } from "../../provider/AuthProvider";

export default function ({ navigation }) {
  let endpoint = "http://localhost:3080/api/v1";
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accesstoken, setAccessToken] = useState('');
  const [companySetting , setcompanySetting] = useState('');
  const auth = useContext(AuthContext);
  let reqdata  = {
      loginDetails : null,
      timezone : null,
      withOutLogin : null
  };
  let RestrictedDomain;
  RestrictedDomain = '';
  let _encryptedData;

  function AuthenticateUser() {
    setLoading(true);
    let loginDetails = `${email}&${password}`;
    Encrypt(loginDetails)
      .then(async (encryptedData) => {
        _encryptedData = encryptedData;
    }).then(async ()=>{
      let res = await getUserToken();
      console.log("res",res);
      if (res.status) {
          if (res.data['passwordExpiryDays'] != undefined && res.data['passwordExpiryDays'] != null && res.data['passwordExpiryDays'] != "") {
            Error(res.message);
          }
          if (res.data['guid'] != null && res.data['guid'] != undefined && res.data['guid'] != "") {
            // this.router.navigate(['/resetpassword'], { queryParams: { 'guid': res.data['guid'] } });
          }
          const userEmail = res.data && (res.data.email ? res.data.email : 
            (res.data.userData && res.data.userData.email))

          const result = await IsDomainRestricted(userEmail, RestrictedDomain);
          if (result.status) {
            const isDomainRestricted = result.isDomainRestricted
            if (isDomainRestricted) return Error('Please access application using single sign on portal');

            if (res.data.mfa_enabled == 1) {
              if (res.data.authenticate_user != null &&
                res.data.authenticate_user == '"OKTA"') {
                Error('Please access application using single sign on portal');
              }
              else if (res.data.authenticate_user != null &&
                res.data.authenticate_user == '"Twilio"') {
                sessionStorage.setItem('mfa_uniqueID', res.data.mfa_unique_id);
                // const notificationMessage: NavigationExtras = { state: { message: res.message } };
                // this.router.navigate(['/mfa'], notificationMessage);
              }
            }
            else {
              getUserAuthenticatedDetails(res);
            }
          }
      }
      else {
        Error(res.message);
      }
    });
  }

  async function IsDomainRestricted(email, domain) {
      const url = `${endpoint}/merchants?${querystring.stringify({email,domain})}`;
      const _response = await fetch(url);
      return _response;
  }

  async function Encrypt(data) {
      console.log(data);
      // const kms = new KMS();
      const kms = new KMS({
          accessKeyId: "AKIA267VP4XYBRWWLD5W",
          // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: "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",
          // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: "us-east-1",
          // region: process.env.REGION,
      });

      const encryptParams = {
        KeyId: "10d21e14-9887-4090-abf8-9503b320d5ef",
        EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
      //   Plaintext: data
        Plaintext: Buffer.from(data)
      };
      
      return new Promise((resolve, reject) => {
        kms.encrypt(encryptParams, (err, data) => {
          if (err) reject(err);
          else {
            let buff = Buffer.from(data.CiphertextBlob);
            let encryptedBase64data = buff.toString('base64');
            resolve(encryptedBase64data);
          }
        });
      });

  }

  function Decrypt(data) {

      const kms = new KMS();

      const params = {
          KeyId: process.env.AWS_KMS_KEY_ID,
          EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
          CiphertextBlob: Buffer.from(data, 'base64')
      };

      return new Promise((resolve, reject) => {

          kms.decrypt(params, (err, data) => {

          if (err) reject(err);
          else {
              resolve(data.Plaintext.toString());
          };
          });

      });
  }

  async function getUserToken(){
    console.log(_encryptedData);
    reqdata['loginDetails'] = _encryptedData;
    reqdata['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    reqdata['withOutLogin'] = false;
    console.log(reqdata);
    const resp = await fetch(`${endpoint}/authenticate`, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }),
      body: JSON.stringify(reqdata)
    });
    const data = await resp.json();
    if(data)
      token = JSON.stringify(data).split(':')[1];
    return data;
  }

  async function getUserAuthenticatedDetails(res){
    let userinfo;
    // let userinfo: UserDetailType = new UserDetailType();
    userinfo = res.data['userData'];
    // userinfo = jsonConvert.deserialize(res.data['userData'], UserDetailType);
    var result= '';
    var characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let lenRandomStr=6;
    var charactersLength = characters.length;
    for ( var i = 0; i < lenRandomStr; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userinfo.ProfilePicPathUrl=userinfo.ProfilePicPathUrl+'?r='+result;
    if (res.data['jwtToken'] != undefined && res.data['jwtToken'] != null && res.data['jwtToken'] != "")
    localStorage.setItem("userToken", res.data['jwtToken']);
    localStorage.setItem("userInfo", JSON.stringify(userinfo));
    console.log(userinfo);
    setLoading(false);
    auth.assignUser(true);
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
              source={require("../../../assets/login.png")}
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
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Login into your Account
            </Text>
            <Text>Username</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Sign in"}
              onPress={() => {
                AuthenticateUser();
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
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <Text size="md" fontWeight="bold">
                  Forget password
                </Text>
              </TouchableOpacity>
            </View>
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
