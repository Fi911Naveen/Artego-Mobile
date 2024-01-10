import React, { useContext, useEffect, useState } from "react";
import { View, Linking, StyleSheet } from "react-native";
import {
    Layout,
    Button,
    Text,
    TopNav,
    Section,
    SectionContent,
    useTheme,
    themeColor,
    TextInput,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigation } from '@react-navigation/native';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FormInput } from "../../common/FormInput";
import { MerchantDetails, MerchantObject } from "../../GetTypes/merchant";
import { EntityTypeMaster } from "../../enums/entitytypemaster";
import { APIEndPoint } from "../../../envirnment";

export default function NewProposals() {
    const auth = useContext(AuthContext);
    let navigation = useNavigation();
    let userData : any = localStorage.getItem("userInfo") || {};
    const [loading, setLoading] = useState(false);
    const {isDarkmode, setTheme} = useTheme();
    const [dba_name, setDBAName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [agentId, setAgentId] = useState();
    const [agentEmail, setAgentEmail] = useState('');
    const [contactName, setcontactName] = useState('');
    const [merchantData , setMerchantData] = useState<MerchantDetails>();
    let _merchantdata : MerchantDetails;
    let name;

    useEffect(() => {
        userData = JSON.parse(userData);
        if(userData){
            setAgentId(userData['id']);
            setAgentEmail(userData['email']);
        }
    });
    
    async function CreateProposal(){
        if(businessEmail == "" || contactName == "" || dba_name==""){
            alert("please enter mandatory fields")
            return;
        }
        setLoading(true);
        let _merchantData = JSON.parse(JSON.stringify(MerchantObject));
        _merchantData.sectionId = EntityTypeMaster.QuickFill.toString();
        _merchantData.businessInformation.agentId = agentId;
        _merchantData.businessInformation.agentEmail = agentEmail;
        _merchantData.businessInformation.dba.name = dba_name;
        _merchantData.businessInformation.contactEmail = businessEmail;
        _merchantData.businessInformation.agentFirstName = userData.first_name;
        _merchantData.businessInformation.agentLastName = userData.last_name;
        _merchantData.businessInformation.contactName = contactName;
        
        const resp = await fetch(`${APIEndPoint}/merchants`, {
            method: 'POST',
            headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              }),
            body: JSON.stringify(_merchantData)
        });
        const data = await resp.json();
        if(data.status == true){
            alert(data.message)
        }else{
            alert(data.message)
        }
        setLoading(false);
    }

    function ResetValues(){
        setDBAName('');
        setBusinessEmail('');
    }

    return (
        <Layout>
            <TopNav
                middleContent="Create Proposals"
                leftContent1={
                    <Ionicons
                        name={isDarkmode ? "sunny" : "moon"}
                        size={20}
                        color={isDarkmode ? themeColor.white100 : themeColor.dark}
                    />
                }
                leftAction1={() => {
                    if (isDarkmode) {
                        setTheme("light");
                    } else {
                        setTheme("dark");
                    }
                }}
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
                    if (responce)
                        auth.assignUser(false);
                }}
            />
            <View style={{
                padding : 20
            }}>
            <Text>DBA Name*</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder="Enter DBA name"
              value={dba_name}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(text) => setDBAName(text)}
            />
            <Text>Business Email*</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder='Business Email'
              value={businessEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(text) => setBusinessEmail(text)}
            />
            <Text>Contact Name*</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 }}
              placeholder='Contact Name'
              value={contactName}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onChangeText={(text) => setcontactName(text)}
            />
            <Text>Agent Email</Text>
            <TextInput
              containerStyle={{ marginTop: 5,marginBottom:5 ,pointerEvents:"none" }}
              placeholder='Agent Email'
              value={agentEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
            />

            <Button
              text= {loading ? "Saving" : "Save"}
              onPress={() => {
                CreateProposal();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
            {/* <Button
              text= "Reset"
              status="warning"
              onPress={() => {
                ResetValues();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            /> */}
            </View>
        </Layout>
    );

}

const styles = StyleSheet.create({
    fullview:{
        padding : 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    InputContainer: {
        height: 42,
        borderWidth: 1,
        paddingLeft: 20,
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 25,
        marginBottom : 10
      },
});