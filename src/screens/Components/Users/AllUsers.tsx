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
import { AuthContext } from "../../../provider/AuthProvider";
import { AllUsersObject } from "../../../GetTypes/users";
import { APIEndPoint } from "../../../../envirnment";
import querystring from 'querystring';
import { EntityTypeMaster } from "../../../enums/entitytypemaster";

export default function AllUsers() {
  const { isDarkmode, setTheme } = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [isUsersLoading, setUsersLoading] = useState(true);
  const [pageno,setPageNo]= useState(1);
  const [recordsperpage,setrecordsperpage]= useState(10);
  const [allUsers,setAllUsers] = useState<AllUsersObject[]>([]);
  const [allUserscount,setAllUsersCount] = useState();
  let navigation = useNavigation();
  const auth = useContext(AuthContext);

  useEffect(() => {
    getAllUsers();
  }, []);

  function sendObservableObject(showcount : any){
    return {
      // "profiletype" : null,
      "startdate" : "Invalid date",
      "enddate" : "Invalid date",
      // "role" : null,
      // "searchtext" : null,
      "status" : EntityTypeMaster.Active,
      // "reportsto" : null,
      // "iso" : null,
      "pageno" : pageno || 1,
      "recordsperpage" : recordsperpage || 10,
      "showcount" : showcount,
      // "partnername" : null,
      // "partnerid" : null,
      // "groupname" : null,
      // "regionname" : null,
      // "groupid" : null,
      // "regionid" : null,
      "is_export_required" : false
    }
  }

  const getAllUsers = async () => {
    try {
      setUsersLoading(true);
      let dataparams:any = sendObservableObject(0);
      const data = `${APIEndPoint}/users?${querystring.stringify(dataparams)}`;
      const _dataresponse = await fetch(data);
      const datajson = await _dataresponse.json();
      if(datajson.status == true){
        setAllUsers(datajson.data.users);
        setAllUsersCount(datajson.data.records_count);
        console.log(datajson.data.users);
      }
      else
        alert(datajson.message);

    } catch (error) {
      console.error(error);
    } finally {
      setUsersLoading(false);
    }
  }

  return (
    <Layout>
      <TopNav
        middleContent="All Users" 
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
      {isUsersLoading ? (
        <ActivityIndicator />
        ) : (
        <FlatList
          data={allUsers}
          keyExtractor={({id}) => id}
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
                  <b> Name : </b> <span>{item.first_name} {item.middle_name} {item.last_name}</span><br></br>
                  <b> Role : </b> {item.role} <br></br><b> Email : </b> {item.email}
                  <hr></hr>
                </Text>
              </div>
            </div>
          )}
        />
      )}
      <Text style={{fontSize:12}}><b> Total Records : </b>{allUserscount || 'not fetched'} | <b>Records per Page: </b> {recordsperpage}</Text>
    </Layout>
  );
}
