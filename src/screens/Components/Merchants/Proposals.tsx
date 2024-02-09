import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../../provider/AuthProvider";
import { useNavigation } from '@react-navigation/native';
import querystring from 'querystring';
import { APIEndPoint } from "../../../../envirnment";
import { Menus } from "../../../enums/menus";
import * as  utility from '../../../utility/commonutility';

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
  merchant_id: any,
  dba_name: any,
  mid: any,
  creation_date:any,
  legal_name: any,
  status: any,
  phone: any,
  contact_name: any,
  contact_email: any,
  agent_name: any,
  status_id: any,
  processor_id: any,
  processor_name: any,
  processor: any,
  bank_number: any,
  bin_number: any,
  merchant_type: any,
  ownership_type: any,
  boarded_date: any,
  status_modified_date: any,
  internal_mid: any,
  reason_code_id: any,
  assign_to: any,
  agent_contact_email: any,
  agent_contact_name: any,
  is_mid_pool: any,
  is_full_uw_approval: any,
  is_welcome_kit_sent: any,
  activation_needed: any,
  is_surcharge: any,
  monthly_volume: any,
  pendDistributionList: any,
  average_ticket: any,
  card_swiped_percent: any,
  un_pended: any,
  status_comment: any,
  partner_name: any,
  partner_code: any,
  mcc_name: any,
  mcc_code: any,
  risk_category_id: any,
  risk_category_name: any,
  risk_tag: any,
  group_name: any,
  region: any
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
  let pageName : string = "contract";

  useEffect(() => {
    if(!localStorage.getItem('userToken')){
      auth.assignUser(false);
      return;
    }
    // getMerchantBasicInfo();
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
      setProposalsLoading(true);
      setProposalscount('');
      let dataparams:any = sendObservableObject(0);
      dataparams.Moduleid = 1;
      const data = `${APIEndPoint}/merchants?${querystring.stringify(dataparams)}`;
      console.log("data ",data);
      dataparams["showcount"] = 1;
      const records = `${APIEndPoint}/merchants?${querystring.stringify(dataparams)}`;
      const _dataresponse = await fetch(data);
      const _recordsresponse = await fetch(records);
      const datajson = await _dataresponse.json();
      const recordsjson = await _recordsresponse.json();
      if(datajson.status == true){
        setProposals(datajson.data.records);
      }
      else
        alert(datajson.message);
      if(recordsjson.status == true){
        setProposalscount(recordsjson.data.records_count);
      }
      else
        alert(recordsjson.message);

    } catch (error) {
      console.error(error);
    } finally {
      setProposalsLoading(false);
    }
  };

  function sendObservableObject(showCount : any) {
    return {
      'searchtext': null,
      'agent': null,
      'assignedto': null,
      'processor': null,
      "groupname": null,
      "regionname": null,
      'status': null,
      "pageno": pageno || 1,
      "recordsperpage": recordsperpage || 10,
      "showcount": showCount,
      "bucketid": Menus.Proposals,
      "groupid": null,
      "regionid": null,
      "pagename" : pageName,
      "partnername": null,
      "partnerid": null
    }
  }

  function CheckPermission(permissionId: number) {
    if (permissionId != undefined && permissionId != null)
      return utility.HasPermission(permissionId);
  }

  return (
    <Layout>
      <TopNav
        middleContent="Proposals"
        // leftContent1={
        //   <Ionicons
        //     name={isDarkmode ? "sunny" : "moon"}
        //     size={20}
        //     color={isDarkmode ? themeColor.white100 : themeColor.dark}
        //   />
        // }
        // leftAction1={() => {
        //   if (isDarkmode) {
        //     setTheme("light");
        //   } else {
        //     setTheme("dark");
        //   }
        // }}
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
              <div style={{float:"left"}}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 55,
                    width: 55,
                  }}
                  source={require("../../../../assets/user.png")}
                />
              </div>
              <div>
                <Text style={{fontSize:11}}>
                  <b> DBA Name : </b> <span>{item.dba_name}</span><br></br>
                  <b> Contact Name : </b> {item.contact_name} <br></br><b> Contact Email : </b> {item.contact_email}
                  <hr></hr>
                </Text>
              </div>
            </div>
          )}
        />
      )}
      <Text style={{fontSize:12}}><b> Total Records : </b>{proposalscount || 'not fetched'} | <b>Records per Page: </b> {recordsperpage}</Text>
    </Layout>
  );
}