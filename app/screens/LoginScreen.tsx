import React, {useState, FC, useEffect } from "react"
import { Dimensions, View, Image, ImageStyle,  TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import  "elliptic";
import Web3Auth, { LOGIN_PROVIDER, OPENLOGIN_NETWORK, State } from "@web3auth/react-native-sdk";
import { Buffer } from "buffer";
import { observer } from "mobx-react-lite"


import * as WebBrowser from "expo-web-browser";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import NodeDetailManager from "@toruslabs/fetch-node-details";
import Torus from "@toruslabs/torus.js";



interface FormData {
  name: string;
  password: string;
  confirmPassword: string;
}
const useTorusGoogleSignIn = (): {
  privateKey: Uint8Array | undefined;
  email: string | undefined;
} => {
  const [privateKey, setPrivateKey] = useState<Uint8Array | undefined>();
  const [email, setEmail] = useState<string | undefined>();


  const naviagtion = useNavigation();

  useEffect(() => {
    

    (async () => {
      try {
        console.log("luca log started")
        const nonce: string = Math.floor(Math.random() * 10000).toString();
        const state = encodeURIComponent(
          Buffer.from(
            JSON.stringify({
              instanceId: nonce,
              redirectToOpener: false,
            })
          ).toString("base64")
        );

        const finalUrl = new URL(
          "https://accounts.google.com/o/oauth2/v2/auth"
        );
        finalUrl.searchParams.append("response_type", "token id_token");
        finalUrl.searchParams.append(
          "client_id",
          "413984222848-8r7u4ip9i6htppalo6jopu5qbktto6mi.apps.googleusercontent.com"
        );
        finalUrl.searchParams.append("state", state);
        finalUrl.searchParams.append("scope", "profile email openid");
        finalUrl.searchParams.append("nonce", nonce);
        finalUrl.searchParams.append("prompt", "consent select_account");
        finalUrl.searchParams.append(
          "redirect_uri",
          "https://oauth.keplr.app/google.html"
        );

        const result = await WebBrowser.openAuthSessionAsync(
          finalUrl.href,
          "app.keplr.oauth://"
        );
        if (result.type !== "success") {
          throw new Error("Failed to get the oauth");
        }

        if (!result.url.startsWith("app.keplr.oauth://google#")) {
          throw new Error("Invalid redirection");
        }

        const redirectedUrl = new URL(result.url);
        const paramsString = redirectedUrl.hash;
        const searchParams = new URLSearchParams(
          paramsString.startsWith("#") ? paramsString.slice(1) : paramsString
        );
        if (state !== searchParams.get("state")) {
          throw new Error("State doesn't match");
        }
        const idToken = searchParams.get("id_token");
        const accessToken = searchParams.get("access_token");

        const userResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken || idToken}`,
            },
          }
        );

        if (userResponse.ok) {
          const userInfo: {
            picture: string;
            email: string;
            name: string;
          } = await userResponse.json();

          const { email } = userInfo;

          const nodeDetailManager = new NodeDetailManager({
            network: "mainnet",
            proxyAddress: "0x638646503746d5456209e33a2ff5e3226d698bea",
          });
          const {
            torusNodeEndpoints,
            torusNodePub,
            torusIndexes,
          } = await nodeDetailManager.getNodeDetails({
            verifier: "chainapsis-google",
            verifierId: email.toLowerCase(),
          });

          const torus = new Torus();

          const response = await torus.getPublicAddress(
            torusNodeEndpoints,
            torusNodePub,
            {
              verifier: "chainapsis-google",
              verifierId: email.toLowerCase(),
            },
            true
          );
          const data = await torus.retrieveShares(
            torusNodeEndpoints,
            torusIndexes,
            "chainapsis-google",
            {
              verifier_id: email.toLowerCase(),
            },
            (idToken || accessToken) as string
          );
          if (typeof response === "string")
            throw new Error("must use extended pub key");
          if (
            data.ethAddress.toLowerCase() !== response.address.toLowerCase()
          ) {
            throw new Error("data ethAddress does not match response address");
          }

          setPrivateKey(Buffer.from(data.privKey.toString(), "hex"));
          setEmail(email);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (e) {
        console.log(e);
        naviagtion.goBack();
      } finally {
     
      }
    })();

    
  }, []);

  return {
    privateKey,
    email,
  };
};


interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  
  const $iconStyle: ImageStyle = { width: 30, height: 30 }
  
  const welcomeLogo = require("../../assets/images/logo.png")
  
  const { privateKey, email } =  useTorusGoogleSignIn();

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.


  }, [])

  const clientId ="BJ3krf9XzUTs5YTOKjI8QO0T36e43xDO6FNgssCFtVQMkgjhvPSZHmlY2q_SLWjZ_LS4JgVxGtw5dI-xZvyP6nc";
  const scheme = "GradiWallet";
  
  const login = async () => {
    console.log('Logged In Luca start');
    if (!privateKey || !email) {
      return;
    }
    console.log('Logged In Luca start',privateKey, email );

 }

 
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
