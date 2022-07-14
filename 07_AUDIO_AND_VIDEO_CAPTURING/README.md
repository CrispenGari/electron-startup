### Audio and Video Capturing

In this repository we are going to create a simple screen recoder using `electronjs`.

If we run the following script in the `whenReady()` function:

```js
desktopCapturer
  .getSources({ types: ["screen", "window"] })
  .then((data) => console.log(data));
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

We will geth the following response:

```js
[
  {
    name: 'Entire Screen',
    id: 'screen:0:0',
    thumbnail: NativeImage {
      toPNG: [Function: toPNG],
      toJPEG: [Function: toJPEG],
      toBitmap: [Function: toBitmap],
      getBitmap: [Function: getBitmap],
      getScaleFactors: [Function: getScaleFactors],
      getNativeHandle: [Function: getNativeHandle],
      toDataURL: [Function: toDataURL],
      isEmpty: [Function: isEmpty],
      getSize: [Function: getSize],
      setTemplateImage: [Function: setTemplateImage],
      isTemplateImage: [Function: isTemplateImage],
      isMacTemplateImage: [Getter/Setter],
      resize: [Function: resize],
      crop: [Function: crop],
      getAspectRatio: [Function: getAspectRatio],
      addRepresentation: [Function: addRepresentation]
    },
    display_id: '2528732444',
    appIcon: null
  },
  {
    name: 'main.js - electron-startup - Visual Studio Code',
    id: 'window:197700:0',
    thumbnail: NativeImage {
      toPNG: [Function: toPNG],
      toJPEG: [Function: toJPEG],
      toBitmap: [Function: toBitmap],
      getBitmap: [Function: getBitmap],
      getScaleFactors: [Function: getScaleFactors],
      getNativeHandle: [Function: getNativeHandle],
      toDataURL: [Function: toDataURL],
      isEmpty: [Function: isEmpty],
      getSize: [Function: getSize],
      setTemplateImage: [Function: setTemplateImage],
      isTemplateImage: [Function: isTemplateImage],
      isMacTemplateImage: [Getter/Setter],
      resize: [Function: resize],
      crop: [Function: crop],
      getAspectRatio: [Function: getAspectRatio],
      addRepresentation: [Function: addRepresentation]
    },
    display_id: '',
    appIcon: null
  },
  {
    name: 'Electron - Audio and Video Capturing - Brave',
    id: 'window:131720:0',
    thumbnail: NativeImage {
      toPNG: [Function: toPNG],
      toJPEG: [Function: toJPEG],
      toBitmap: [Function: toBitmap],
      getBitmap: [Function: getBitmap],
      getScaleFactors: [Function: getScaleFactors],
      getNativeHandle: [Function: getNativeHandle],
      toDataURL: [Function: toDataURL],
      isEmpty: [Function: isEmpty],
      getSize: [Function: getSize],
      setTemplateImage: [Function: setTemplateImage],
      isTemplateImage: [Function: isTemplateImage],
      isMacTemplateImage: [Getter/Setter],
      resize: [Function: resize],
      crop: [Function: crop],
      getAspectRatio: [Function: getAspectRatio],
      addRepresentation: [Function: addRepresentation]
    },
    display_id: '',
    appIcon: null
  },
  {
    name: 'WhatsApp',
    id: 'window:132084:0',
    thumbnail: NativeImage {
      toPNG: [Function: toPNG],
      toJPEG: [Function: toJPEG],
      toBitmap: [Function: toBitmap],
      getBitmap: [Function: getBitmap],
      getScaleFactors: [Function: getScaleFactors],
      getNativeHandle: [Function: getNativeHandle],
      toDataURL: [Function: toDataURL],
      isEmpty: [Function: isEmpty],
      getSize: [Function: getSize],
      setTemplateImage: [Function: setTemplateImage],
      isTemplateImage: [Function: isTemplateImage],
      isMacTemplateImage: [Getter/Setter],
      resize: [Function: resize],
      crop: [Function: crop],
      getAspectRatio: [Function: getAspectRatio],
      addRepresentation: [Function: addRepresentation]
    },
    display_id: '',
    appIcon: null
  }
]
```

Now we want to recode the Entire Screen so we will do it as follows:
