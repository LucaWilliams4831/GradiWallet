import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigation} from "@react-navigation/native";


import { Button } from "../../../components";
import * as WebBrowser from "expo-web-browser";
import { Buffer } from "buffer/";
import NodeDetailManager from "@toruslabs/fetch-node-details";
import Torus from "@toruslabs/torus.js";

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    privateKey,
    email,
  };
};


export const TorusSignInScreen: FunctionComponent = observer(() => {


  // Below uses the hook conditionally.
  // This is a silly way, but `route.params.type` never changed in the logic.
  const { privateKey, email } =  useTorusGoogleSignIn();
  console.log("privateKey++++++++", privateKey)
  console.log("email++++++++", email)

  return (
   <Button>AAAAA</Button>
  );
});
