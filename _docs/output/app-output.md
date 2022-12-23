---
title: App output
categories: output
order: 4
---

# App output
{:.no_toc}

* Page contents
{:toc}

Run `npm run electric-book` on the command line to see app-related options.

App output and this documentation is still experimental and a work in progress. It requires that you have Apache Cordova installed, and Android Studio (for Android apps), X Code (for iOS apps) or Visual Studio (for Windows apps).

## Android

The default output will be a debug version of your app for local testing only.

To create a signed release, create or check that you have a `secrets.yml` file in `_data`. *Do not* commit `secrets.yml` (or any file you link to inside it, like a keystore) to version control.

> Note: If you're building a large app that requires an expansion file for Google Play, see [our template for creating an Android app with an expansion file](https://github.com/electricbookworks/electric-book-android).

### Generating a keystore

If you need to generate a keystore, the easiest way to do this is with Android Studio.

1. Open the project (the repo) in Android Studio, then go to 'Build > Generate signed APK...'.
2. Fill in the prompts, and your `.jks` keystore will appear where you've defined there that it should.

If you're working on a project that already has an app, a keystore probably already exists for your project, and you should use that one. Its password and the password for the key it contains should be stored somewhere safely for you to find.

> Note: The first time you set up a new app, you'll go to 'App signing' on Google Play for your certificate. Google Play will say that you will get a certificate once you've uploaded an APK. You worry, because you wonder whether Google will accept an unsigned APK. So you upload an insigned APK and Google Play says that it can't use that because it's unsigned. You are rightly confused by this. Then go back to 'App signing' and, voila, magically there is now a certificate ready for you to use to sign your APK.

### On app prep and signing

> For each application, the Google Play service automatically generates a 2048-bit RSA public/private key pair that is used for licensing and in-app billing. The key pair is uniquely associated with the application. Although associated with the application, the key pair is not the same as the key that you use to sign your applications (or derived from it). ... To add licensing to an application, you must obtain your application's public key for licensing and copy it into your application. – [Google Developer guidelines](https://developer.android.com/google/play/licensing/adding-licensing)

These are useful resources:

- [Preparing the app](https://developer.android.com/studio/publish/preparing)
- [Signing the app](https://developer.android.com/studio/publish/app-signing)
- [Launch checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)
- [App signing with Google Play Signing](https://medium.com/mindorks/securing-and-optimizing-your-app-with-google-play-app-signing-24a3658fd319)

### Testing

1. Install the `android-debug.apk`\* as an app normally. (I.e. download it to your phone over a network or email, and open the APK file on the device to install it.) Don't open the app yet.

   \* Note that signed apps (`android-release.apk`) can't be tested locally, presumably because once signed the app is only allowed to use expansion files downloaded securely from Google Play.

2. Your app Should Just Work.

## iOS

This is work-in-progress.

See '[Add remote media](#add-remote-media)' below before using the script.

We're still working on the signing process, which is done in X Code.

## Windows

You must have Visual Studio installed with all requirements for Cordova Windows Apps installed. The basic process will be:

1. Create a listing in the Microsoft app store. (Once-off.)
1. Check that `google-play-expansion-file` is not enabled in `settings.yml`.
1. Build app HTML with Jekyll.
2. Add the Windows app platform files with Cordova.
3. Build the app for release with Visual Studio.

Here are the detailed steps:

1. [Create a listing in the Microsoft app store](https://developer.microsoft.com/en-us/dashboard/). Some of the forms you need to complete may only work in Edge (!). If this is already done, perhaps check that it's up to date and add any release notes.
1. Create or check that you have a `secrets.yml` file in `_data` with the `windows` `package-identity-name`, `publisher-id` and `publisher-display-name` filled in. (And remember *never* to commit secrets to version control.)
   - You get the package identity name from the Windows & Xbox dashboard on the Microsoft website, under 'Product management > Product identity'.
   - You can get the `publisher-id` value there from your Windows developer settings.
   - If you're creating a one-language translation app, this should have a section for the language. E.g.:

      ```
      android:
        app-path-to-keystore: "path/to/keystore"
        app-keystore-password: "passwordhere"
        app-key-alias: "keyaliashere"
        app-key-password: "keypasswordhere"
      ios:
        development-team-id: "YOURTEAMID"
        package-type: "development"
      windows:
        package-certificate-key-file: ""
        package-thumbprint: ""
        package-identity-name: "FireandLion.TheEconomybyCORE"
        publisher-id: "CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
        publisher-display-name: "Electric Book Works"
      fr:
        android:
          app-path-to-keystore: "path/to/keystore"
          app-keystore-password: "passwordhere"
          app-key-alias: "keyaliashere"
          app-key-password: "keypasswordhere"
        ios:
          development-team-id: "YOURTEAMID"
          package-type: "development"
        windows:
          package-certificate-key-file: ""
          package-thumbprint: ""
          package-identity-name: "FireandLion.LconomieparCORE"
          publisher-id: "CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
          publisher-display-name: "Electric Book Works"
      ```

1. Ensure that `google-play-expansion-file-enabled` is not set in `_data/settings.yml` (that's only for Android).
1. Use the output script to create the app-ready HTML only. If you're creating a translation app, when the output script asks for extra config files, enter the relevant config file for that language. E.g. for French: `_configs/_config.app.fr.yml`
2. If you're using external media, copy the images from the remote media repo manually to `_site/app/www/book/images` (or the equivalent translation images folder; see '[Add remote media](#add-remote-media)' below for more detail).
2. At a command prompt in the repo root, run `cd _site/app && cordova platform rm windows && cordova platform add windows && cordova build windows`
3. Open Visual Studio. From there, open the Cordova solution file (`.sln`) in `_site/app/platforms/windows`, and deploy and and build for your local machine to test. (You should be able to click the '► Local machine' button in the toolbar.)
4. We recommend building a Release version (not a Debug version) to test that the app works when fully signed. To do this:
    1. Associate the app with an app listing in the store. Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Associate App with the Store... (You may only have to do this once.)
    2. Under `CordovaApp.Windows10 (Universal Windows)` open `package.windows10.appxmanifest` and add the language code to the 'Default language' field. You can also correct the description, which Visual Studio or Cordova aren't getting right currently. Save the file.
    3. In the toolbar, select 'Release' instead of 'Debug' and select your computer's architecture in the next box (usually 'x64'). Then click the '► Local machine' button in the toolbar. (Sometimes you get an error and have to enter the language again in the 'Default language' field. Then retry '► Local machine'.) If the process works and you're on Windows, it should install the app to your computer, where you should open and test it.
5. To prepare for the Windows store, use Visual Studio following the guidance in [this article](https://docs.microsoft.com/en-us/windows/uwp/packaging/packaging-uwp-apps). In short, you will:
    1. Use VS's Solution Explorer (a panel on the right, which you can show with View > Solution Explorer). Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Associate App with the Store... and select the correct app that appears. This will sign the app with the correct certificate. (You may only have to do this once.)
    1. However, this unsets the default language that Cordova adds to non-release builds. So under `CordovaApp.Windows10 (Universal Windows)` open `package.windows10.appxmanifest` and add the language code to the 'Default language' field. You can also correct the description, which Visual Studio or Cordova aren't getting right currently.
    1. Now create an app package upload file. Use VS's Solution Explorer (a panel on the right, which you can show with View > Solution Explorer). Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Create App Packages.
    2. When setting the version number, we use the same version as the project version in `_data/project.yml`, with an extra zero (e.g. if the `project.yml` version number is `1.0.5`, your Windows app version number will be `1.0.5.0`.
    4. In the 'Generate app bundle' listbox, select 'Always'.
    3. Select the three architecture configurations ('x86', 'x64', and 'ARM') in the Select and Configure Packages dialog. Deselect the 'Neutral' option.
    5. Click Create and hold thumbs.
    6. Validate your app before you submit it to Dev Center. To validate, leave the Local machine option selected and click Launch Windows App Certification Kit.

6. Run the app locally to check that it works. If you're debugging, if your WACK reports show failures, the event logs are in `C:\ProgramData\Microsoft\Windows\WER\ReportArchive`.
7. Visual Studio saves the `.appxupload` file in `\_site\app\platforms\windows\AppPackages`. Remember to save the `appxupload` for backup, because it'll get overwritten the next time you build. If the app release is working, upload it to the Dev Center.

### Troubleshooting

- UWP apps created by Cordova are still using the old/original Edge renderer i.e. not Chromium. The [Microsoft Edge DevTools Preview](https://www.microsoft.com/en-za/p/microsoft-edge-devtools-preview/9mzbfrmz0mnj) app can be used to display a full devtools environment when debugging issues in the Windows app. To do this, run the Windows app you want to debug (this can be a local build as outlined in step 7 above), then launch the Microsoft Edge DevTools Preview app and 'connect' to the relevant app.
- Sometimes, when you build a release, you get a white screen when opening the app or any page inside it. [This post explains a likely reason](https://stackoverflow.com/questions/39200592/visual-studio-2015-cordova-windows-10-blank-white-screen-after-associated-with), which is that Visual Studio has changed the Package Name based on what's in your Windows account, and it doesn't match what you have in your app. To get it right, `WindowsStoreIdentityName` and `WindowsStorePublisherName` must be correct in the output `config.xml`, which is populated from what you have in `_data/secrets.yml`.
- Another possible reason for the white screen of doom is that Cordova is not setting the default language in `package.windows10.appxmanifest`, which is is supposed to read from `config.xml`. This seems to be because when associating the app with the store, Visual Studio unsets the default language. To fix this manually, open `package.windows10.appxmanifest` in Visual Studio and add the language code to 'Default language'.

### Add remote media

If your project uses remote-media (storing images in a separate project), you need to:

1. Generate the app HTML using the output script.
2. Manually, temporarily, copy `/book/images/app` folder from your external-media project to `_site/app/www/book/images` in your main project. If you're building a translation, this should be the equivalent translation images folder, e.g. copy `/book/fr/images/app` to `_site/app/www/book/fr/images` for French.
3. Build the app with Cordova by running this from the project root: `cd _site/app && cordova platform rm windows && cordova platform add windows@6.0.0 && cordova build windows`
