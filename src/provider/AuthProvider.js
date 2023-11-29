import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  let endpoint = "http://localhost:3080/api/v1";
  const [loading, setLoading] = useState(false);
  const [companySetting , setcompanySetting] = useState('');

  useEffect(() => {
    getCompanySettingInfo();
    ValidateToken();
  }, []);

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
      const resp = await fetch(`${endpoint}/authorizeAccess`, {
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
      const url = `${endpoint}/companysetting`;
      const data = await fetch(url);
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
