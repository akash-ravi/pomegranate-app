/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#fff';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#F4DEB3',
    tint: tintColorLight,
    icon: '#000',
    navBackground: '#FF8A8A',
    itemBackground: '#CCE0AC',
    tabIconDefault: '#000',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    navBackground: '#8a4949',
    itemBackground: '#899674',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
