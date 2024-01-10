import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "../provider/AuthProvider";
// Main
import Home from "../screens/Home";
import SecondScreen from "../screens/SecondScreen";

// Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";

import Loading from "../screens/utils/Loading";
import Proposals from "../screens/Components/Proposals";
import NewProposals from "../screens/Components/NewProposal";

const AuthStack = createNativeStackNavigator();

const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();

const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
      <MainStack.Screen name="Proposals" component={Proposals} />
      <MainStack.Screen name="NewProposals" component={NewProposals} />
    </MainStack.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext) ;
  const user = auth.user;
  return (
    <NavigationContainer>
      {user == null ? <Loading /> : user == false ? <Auth /> : user == true ? <Main /> : null}
    </NavigationContainer>
  );
};