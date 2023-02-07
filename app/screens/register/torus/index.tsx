import React, {FC, useEffect } from "react"
import { Dimensions, View, Image, ImageStyle,  TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text} from "../../../components"
import { AppStackScreenProps } from "../../../navigators"
import { colors, spacing } from "../../../theme"
import { observer } from "mobx-react-lite"





interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  
  const $iconStyle: ImageStyle = { width: 30, height: 30 }
  
  const welcomeLogo = require("../assets/images/logo.png")
  

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.

  }, [])

  
  const login = async () => {
    console.log('Logged In Luca start');
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
