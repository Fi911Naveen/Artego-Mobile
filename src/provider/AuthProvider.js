import React, { createContext, useState, useEffect } from "react";
import { APIEndPoint, EnvironmentVariables } from '../../envirnment';
const AWS = require('aws-sdk');
const secretMngrClient = new AWS.SecretsManager();
const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companySetting , setcompanySetting] = useState('');

  useEffect(() => {
    setEnvVariables();
    getCompanySettingInfo();
    ValidateToken();
  }, []);

  function setEnvVariables(){
    return new Promise((resolve,reject)=>{
      let _env = process.env || {};
      for(const key in EnvironmentVariables){
        let _object = {}; 
        _object[key] = EnvironmentVariables[key];
        Object.assign(_env , _object)
      }
      // process.env = _env;
    })
  }

  function assignUser(istrue){
    if(!istrue){
      localStorage.clear();
    }
    setUser(istrue);
  }

  async function ValidateToken(){
    let token = localStorage.getItem("userToken");
    console.log(token);
    if(token){
      let headeroptions = {
        headers: new Headers({
            'Authorization': token,
            'Accept': 'application/json',
        })
      }
      const resp = await fetch(`${APIEndPoint}/authorizeAccess`, {
        method: 'POST',
        body: headeroptions,
        // headers: new Headers({
        //   'Authorization': token,
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   })
      });
      const data = await resp.json();
      if(data.status)
        setUser(true);
      else
        setUser(false);
      console.log(data);
    }else{
      setUser(false);
    }
  }

  async function getCompanySettingInfo(){
    try{
      setLoading(true);
      const url = `${APIEndPoint}/companysetting`;
      let headers = new Headers();

      headers.append('Access-Control-Allow-Origin', 'http://localhost:19006');
      headers.append('Access-Control-Allow-Credentials', true);

      headers.append('GET', 'POST', 'OPTIONS','PUT','DELETE');
      const data = await fetch(url);
      // const data = await fetch(url+{headers:headers});
      const _response = await data.json();
      localStorage.setItem('companysetting',JSON.stringify(_response.data));
      setcompanySetting(_response.data);
      // RestrictedDomain = (companySetting[1390065] != null && companySetting[1390065] != undefined) ? companySetting[1390065] : null;
      setLoading(false);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,props,assignUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
