import React, { useContext, useEffect, useState } from "react";
import { View, Linking, TextInput, ActivityIndicator, FlatList } from "react-native";
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
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigation } from '@react-navigation/native';
import querystring from 'querystring';
import { APIEndPoint } from "../../../envirnment";

type MerchantDetails = {
  merchant_id :any;
  dba_name : any;
  mid : any;
  agent_name : any;
  work_number : any;
  email : any;
  contact_name : any;
  contact_email : any;
  processor : any;
  processor_id : any;
  partner_name : any;
  partner_id : any;
}

type MerchantProposals = {
  merchant_id :any;
  dba_name : any;
  mid : any;
  creation_date : any;
  status : any;
  contact_name : any;
  contact_email : any;
  phone : any;
  agent_name : any;
  status_id : any;
  partner_name : any;
  Tradingname : any;
  boarded_date : any;
  internal_mid : any;
}

export default function Proposals() {
  const { isDarkmode, setTheme } = useTheme();
  const auth = useContext(AuthContext);
  let navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [isProposalsLoading, setProposalsLoading] = useState(true);
  const [merchantdata, setMerchantData] = useState<MerchantDetails>();
  const [proposals, setProposals] = useState<MerchantProposals[]>([]);
  const [proposalscount, setProposalscount] = useState('');
  const [pageno, setPageNo] = useState('1');
  const [merchant_id, setMerchantId] = useState('171067');
  const [recordsperpage, setRecordsPerPage] = useState('10');
  
  useEffect(() => {
    getMerchantBasicInfo();
    getProposals();
  }, []);

  const getMerchantBasicInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${APIEndPoint}/merchants/${merchant_id}/basicinfo`);
      const json = await response.json();
      console.log(json);
      console.log(json.data);
      if(json.data != null && json.data != undefined)
        setMerchantData(json.data);
      else
        setMerchantData(undefined)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProposals = async () => {
    try {
      console.log("entered",pageno);
      setProposalsLoading(true);
      setProposalscount('')
      const url = `${APIEndPoint}/merchants?${querystring.stringify({pageno : pageno || "1",recordsperpage : recordsperpage})}`;
      const _response = await fetch(url);
      const json = await _response.json();
      console.log(json.data);
      if(json.status == true){
        setProposals(json.data.records);
        setProposalscount(json.data.records_count)
      }
      else
        alert(json.message);
    } catch (error) {
      console.error(error);
    } finally {
      setProposalsLoading(false);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Proposals"
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
      {/* <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text fontWeight="bold">This is the Proposals screen</Text>
      </View> */}
      {/* <TextInput
        // style={styles.InputContainer}
        placeholder={('Page number')}
        keyboardType="email-address"
        placeholderTextColor="#aaaaaa"
        onChangeText={text => setPageNo(text) }
        value = {pageno}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <Button 
        onPress={getProposals}
        text="Submit"
        color= "blue"
      /> */}
      {isProposalsLoading ? (
        <ActivityIndicator />
        ) : (
          <FlatList
          data={proposals}
          keyExtractor={({merchant_id}) => merchant_id}
          renderItem={({item}) => (
            <div className='row'>
              <Text>
                <b> Merchant Id : </b> {item.merchant_id} <b> DBA Name : </b> {item.dba_name} <hr></hr>
              </Text>
            </div>
          )}
        />
      )}
      <Text><b> Total Records : </b>{proposalscount} | <b>Records per Page: </b> {recordsperpage}</Text>
    </Layout>
  );
}