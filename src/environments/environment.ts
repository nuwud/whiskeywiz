// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    enableImageDebugging: true,
    buildTimestamp: Date.now(),
    firebase: {
      apiKey: "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U",
      authDomain: "whiskeywiz2.firebaseapp.com",
      databaseURL: "https://whiskeywiz2-default-rtdb.firebaseio.com",
      projectId: "whiskeywiz2",
      storageBucket: "whiskeywiz2.appspot.com",
      messagingSenderId: "555320797929",
      appId: "1:555320797929:web:0d4b062d7f2ab330fc1e78",
      measurementId: "G-SK0TJJEPF5"
    },
    useEmulators: false,

    shopify: {
      apiKey: 'bdc9a4fc17b76e6a40e3f7168a2d1188',
      apiSecretKey: '0bd9a2cd26ae0e1bb7f04ba01f863868',
      shopName: 'blind-barrels.myshopify.com',
      redirectUri: 'https://whiskeywiz2.web.app/auth/callback',
      apiUrl: 'https://blind-barrels.myshopify.com/admin/api/2024-01'
    }
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.