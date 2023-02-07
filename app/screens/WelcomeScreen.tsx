import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, View, ViewStyle } from "react-native"

import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors, spacing } from "../theme"

const welcomeLogo = require("../assets/images/logo.png")


interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start

 
  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      </View>
 
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 57,
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.huge,
}
