import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "../provider/AuthProvider";
import { useTheme, themeColor } from "react-native-rapi-ui";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
import { Ionicons } from "@expo/vector-icons";

// Main
import Home from "../screens/Home";
import SecondScreen from "../screens/SecondScreen";

// Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";

import Loading from "../screens/utils/Loading";
import Proposals from "../screens/Components/Merchants/Proposals";
import NewProposals from "../screens/Components/Merchants/NewProposal";
import ResetPassword from "../screens/auth/ResetPassword";
import ValidateOTP from "../screens/auth/ValidateOTP";
import Dashboard from "../screens/Dashboard";
import NewUser from "../screens/Components/Users/NewUser";
import UsersHome from "../screens/UsersHome";
import AllUsers from "../screens/Components/Users/AllUsers";
import SetupHome from "../screens/SetupHome";

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
      <AuthStack.Screen name="ValidateOTP" component={ValidateOTP} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
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
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="SecondScreen" component={SecondScreen} />
      <MainStack.Screen name="Proposals" component={Proposals} />
      <MainStack.Screen name="NewProposals" component={NewProposals} />
      <MainStack.Screen name="UsersHome" component={UsersHome} />
      <MainStack.Screen name="AllUsers" component={AllUsers} />
      <MainStack.Screen name="NewUser" component={NewUser} />
      <MainStack.Screen name="SetupHome" component={SetupHome} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();

const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Dashboard" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Merchants"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Merchants" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"business"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Setup"
        component={SetupHome}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Setup" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"settings-sharp"} />
          ),
        }}
      />
    </Tabs.Navigator>
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