# IS4103KMS
KMS file includes the JAVA EE backend.
1.Make sure to ensure that MySQL is running.
2.Open KMS project in NetBeans
3.Create a database with name kms.
4.and connect to the kms database.
5.Start glassfish server
6.deploy KMS

KMSAngular includes the angular frontend web client
1.go into the KMSAngular folder
2.Copy the file path
3.Open cmd and navigate to the file path with "cd file_path"
4.enter into cmd npm install
5.open your browser and go to localhost:4200

KMSIonic includes the ionic mobile application
1. Ensure that you have downloaded android studios
2. Set the ANDROID_SDK_ROOT environment variable. 
This path should be the Android SDK Location e.g. ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
3. Add the following Android SDK command-line directories to PATH
	1. $ANDROID_SDK_ROOT/tools/bin
	2. $ANDROID_SDK_ROOT/platform-tools
	3. $ANDROID_SDK_ROOT/emulator
4. Enable USB debugging on the device. 
Open Settings, navigate to Developer options, and enable USB debugging. 
The Developer options menu may need to be enabled first.
5. Ensure the device has permission to connect to the computer. 
For macOS, no additional setup is required. 
For Windows, install the OEM USB drivers from https://developer.android.com/studio/run/oem-usb.
6. open up the command prompt and type adb devices, your device should be listed here.
7. Ensure that Gradle is installed. You can refer to httRps://gradle.org/install/ for more info.
8. Navigate into the KMSIonic folder
9. Enter into cmd npm install
10. Run "ionic cordova prepare android" to generate the native project
11. run "ionic cordova run android -l". The application should open up on your mobile device.