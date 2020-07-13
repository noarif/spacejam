import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated from "react-native-reanimated";
import { Logo, ProfileIcon, AddButton } from "../components/Icons";
import { Space } from "../components/Space";
import { Space2 } from "../components/Space2";
import { HomeProps } from "../StackNavigatorTypes";
import firebase from "../components/Firebase";
import { RootState } from "../slices/rootReducer";
import { signOutAction } from "../slices/authReducer";
import AddOption from "../components/AddOption";
import { onAddPress } from "../slices/addSpaceReducer";

let safeMargin: number;

StatusBar.setBarStyle("light-content");

if (Platform.OS == "ios") {
  safeMargin = 0;
} else if ((Platform.OS = "android")) {
  safeMargin = 40;
}

export function HomeScreen({ navigation, route }: HomeProps) {
  const db = firebase.firestore();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const { show } = useSelector((state: RootState) => state.addSpace);

  useEffect(() => {
    const getUserName = async () => {
      const id = await AsyncStorage.getItem("userID");
      if (id != null) {
        const doc = await db.collection("users").doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          if (data != undefined) {
            setUserName(data.firstName);
          }
        }
      }
    };

    getUserName();
  }, []);

  const onSignOut = async () => {
    try {
      await firebase.auth().signOut();
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userID");
      dispatch(signOutAction());
    } catch (error) {
      console.log("Unable to remove user's name and token", error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#191b23", flex: 1 }}>
      <Container>
        <TitleBar style={{ marginTop: safeMargin, marginBottom: 57 }}>
          <IconBar>
            <Logo />
            <TouchableOpacity onPress={() => onSignOut()}>
              <ProfileIcon style={{ marginTop: 20 }} />
            </TouchableOpacity>
          </IconBar>
          <WelcomeView>
            <WelcomeText>Welcome back, </WelcomeText>
            <Name>{userName}</Name>
          </WelcomeView>
        </TitleBar>
        <TouchableOpacity>
          <Space
            num="01"
            spaceName="Josiah's Car"
            spacePattern={require("../assets/spacePattern.png")}
          />
        </TouchableOpacity>
      </Container>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          marginLeft: 20,
          flexGrow: 0,
        }}
      >
        <SpaceContainer>
          <Space2
            color="#FFCF73"
            num="02"
            spaceName="George's Stinky Room"
            spacePattern={require("../assets/spacePattern.png")}
          />
          <Space2
            color="#A9BAFF"
            num="03"
            spaceName="Eli's Headphones"
            spacePattern={require("../assets/spacePattern.png")}
          />
          <Space2
            color="#BB9BFF"
            num="04"
            spaceName="Nibro's Playlist"
            spacePattern={require("../assets/spacePattern.png")}
          />
        </SpaceContainer>
      </ScrollView>
      <AddOptionContainer
        style={{ opacity: show ? 0 : 1, zIndex: show ? 0 : 5 }}
      >
        <AddOption title="Create a space" desc="Just for your friendos" />
        <AddOption title="Join a space" desc="Just for your friendos" />
      </AddOptionContainer>
    </SafeAreaView>
  );
}

const Container = styled.View`
  background: #191b23;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
`;

const TitleBar = styled.View``;

const IconBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WelcomeView = styled.Text`
  margin-top: -10px;
  font-weight: 700;
  font-size: 17px;
`;

const WelcomeText = styled.Text`
  color: rgba(255, 255, 255, 0.5);
`;

const Name = styled.Text`
  color: #e08700;
`;

const SpaceContainer = styled.View`
  flex-direction: row;
  height: 240px;
  padding-right: 13px;
`;

const AddOptionContainer = styled.View`
  position: absolute;
  width: 100%;
  bottom: 0;
  padding-left: 20px;
  padding-right: 20px;
`;
