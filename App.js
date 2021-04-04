/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  AppState,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-community/async-storage';

function AuthScreen({onPress}) {
  return (
    <View>
      <Text>Login Screen</Text>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginLeft: 20,
          marginTop: 10,
        }}
        onPress={onPress}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen({onPress}) {
  return (
    <View>
      <Text>Home screen</Text>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 20,
          marginLeft: 20,
          marginTop: 10,
        }}
        onPress={onPress}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [isLogin, setIsLogin] = React.useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // auto logout on background
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current,
  );

  const _handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      let storedDateTimeStamp = await AsyncStorage.getItem(
        'AutoLogoutTimeStamp',
      );

      let storedDateTimeStampNum = parseFloat(storedDateTimeStamp);

      //15min=900000ms (15*60*1000)

      // 5 minutes
      // let timedAddedToInitialTimeStamp = 300000;

      //  1 minutes
      let timedAddedToInitialTimeStamp = 60000;

      let timeStampTocheck =
        storedDateTimeStampNum + timedAddedToInitialTimeStamp;

      let currentTime = new Date().getTime();

      if (currentTime > timeStampTocheck) {
        // console.log('log user out time has expired');
        setIsLogin(false);
      }
      // console.log('App has come to the foreground!');
    }

    // when app is minimised
    if (appState.current == 'inactive') {
      // console.log('its now inactive');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);

    let initialDateTimeStamp = new Date().getTime().toString(); //Unix timestamp (in milliseconds)
    await AsyncStorage.setItem('AutoLogoutTimeStamp', initialDateTimeStamp);
  };

  React.useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        {isLogin ? (
          <HomeScreen onPress={() => setIsLogin(false)} />
        ) : (
          <AuthScreen onPress={() => setIsLogin(true)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
