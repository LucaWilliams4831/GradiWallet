import { observer } from "mobx-react-lite"
import React, {useState, FC, useEffect } from "react"
import { Dimensions, View, Image, ImageStyle,  TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import  "elliptic";

import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK, State } from "@web3auth/react-native-sdk";
import { Buffer } from "buffer";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
// import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";


// import * as WebBrowser from "expo-web-browser";

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  
  global.Buffer = global.Buffer || Buffer;

  


    

  const $iconStyle: ImageStyle = { width: 30, height: 30 }
  
  const welcomeLogo = require("../../assets/images/logo.png")
  
  const {
    authenticationStore: {
      setAuthEmail,
      setAuthPassword,
    },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")

  }, [])

  const clientId ="BJ3krf9XzUTs5YTOKjI8QO0T36e43xDO6FNgssCFtVQMkgjhvPSZHmlY2q_SLWjZ_LS4JgVxGtw5dI-xZvyP6nc";
  const [key, setKey] = useState('');
  const [userInfo, setUserInfo] = useState('');
  
  const scheme = "GradiWallet";
  const resolvedRedirectUrl = `${scheme}://openlogin`;
  const uiConsole = (...args) => {
   // setConsole(JSON.stringify(args || {}, null, 2) + '\n\n\n\n' + console);
  };

  const login = async () => {
    console.log('Logged In Luca start');
    try {
      const web3auth = new Web3Auth(WebBrowser, {
        clientId,
        network: OPENLOGIN_NETWORK.CYAN, // or other networks
      });
      const info = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'default',
        curve: 'secp256k1',
      });

      
      // console.log(info.privKey)
      
      // setKey(info.privKey);
      console.log('Logged In Luca', info.privKey);
    } catch (e) {
      // console.log('Logged errors herere', e);
      console.log("luca exception logs")
    }
  }

 
  useEffect(() => {
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      style={$container}
    >
       <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      </View>

      <Button
        testID="login-button"
        style={$signButton}
        preset="filled"
        LeftAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="google" />
        )}
        onPress={login}
      >
        <Text tx="loginScreen.googlesignin" preset="subheading" size="xl" style={$googlesignin} />
      </Button>
      <Text tx="loginScreen.poweredBy" preset="subheading" style={$poweredBy} />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}


const $poweredBy: TextStyle = {
  marginTop: "3%",
  marginBottom: spacing.large,
  textAlign: "center",
  color: colors.white,
  fontFamily: "Inter",
  fontWeight: "normal"
}
const $googlesignin: TextStyle = {
  marginTop: spacing.large,
  marginBottom: spacing.large,
  textAlign: "center",
  color: colors.white,
  fontFamily: "Inter",
  fontWeight: "bold"
}

const win = Dimensions.get('window');
const $signButton: ViewStyle = {
  marginTop: win.height * 0.2,
  backgroundColor: colors.signbackground,
  borderColor: colors.buttonborder,
  borderWidth: 2,
  borderRadius: 10,
  marginLeft: "5%",
  width: "90%"
  
}
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  
}
// // @demo remove-file
// const $logoContainer: ViewStyle = {
//   alignSelf: "flex-start",
//   height: 56,
//   paddingHorizontal: spacing.large,
// }



// const $logo: ImageStyle = {
//   height: 42,
//   width: 77,
  
// }

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 70,
  justifyContent: "center",
  marginTop: win.height * 0.3,
 
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  // marginBottom: spacing.huge,
}
