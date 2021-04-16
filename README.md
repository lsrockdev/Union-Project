# Octopus
DataUnion.app's mobile app to use the platform on mobile phones.

# Commands to run the iOS version

Requirements:

pod --version => >= 1.10.1
yarn -v => >= 1.22.4
node -v => >= v14.0.0

XCode + Simulator installed

Then run in the root directory:
yarn
yarn react-native link
npx pod-install
npx react-native run-ios
