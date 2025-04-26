### Install Dependencies
```ts
bun install
```
### To run the Project use 
```ts
bunx expo prebuild && bunx expo run:android
```

### To build With EAS
Make Sure You Have EAS Cli Installed
## Build Debug APK
```ts
eas build --platform android --profile preview
```
## Build Release APK
```ts
eas build --platform android --profile production
```

## Build Locally With EAS
```ts 
eas build --profile development --platform android --local
```

[To build locally visit]
(https://docs.expo.dev/build-reference/local-builds/)

(https://docs.expo.dev/guides/local-app-production/)
