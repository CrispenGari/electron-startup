### Window and App properties

When we create an electron BrowserWindow it gaves us some properties and methods that we can access on the `window` object. In this repository we are going to have a look of getting some of these properties from the window object.

Also an electron app gave us some properties or methods that we can access on the `app` object.

### Window

1. centering the window

```js
win.center();
```

2. hiding the window

```js
win.hide();
```

3. showing the window

```js
win.show();
```

4. closing the window

```js
win.close();
```

5. checking if the window is closable

```js
win.closable; // return boolean
```

6. focus on the window

```js
win.focus();
```

> There are various properties and methods that you can access on the `win` object you can look more in the documentation.

### App

1. checking if the app is an executable

```js
app.isPacked; // true| false
```

2. checking if the application is ready

```js
app.isReady(); // true/false
```

3. getting the app version

- if the application version does not exists electron will take it from the `package.json` file

```js
app.getVersion();
```

4. getting the name of the app

```js
app.getName();
```

5. getting the menu

```js
app.dock.getMenu();
//
console.log(app.applicationMenu);
```

6. setting the app icon

```js
app.dock.setIcon(path.join(__dirname, "icon.ico"));
```

7. getting the path of the app

```js
app.getAppPath();
```

8. getting the country code of the current computer

```js
app.getLocaleCountryCode();
```

9. getting app metrics

```js
app.getAppMetrics();
```

10. get GPU info

```js
app.getGPUInfo("complete").then((res) => console.log(res));
```

11. getting path for folders like `desktop`

```js
app.getPath(name);

//  name can be
names = [
  appData,
  cache,
  crashDumps,
  temp,
  desktop,
  home,
  desktop,
  downloads,
  documents,
  exe,
  logs,
  music,
  pictures,
  recent,
  userData,
  videos,
];
```

> Not that there a a lot of app properties and methods that we can access in electron and you can find them in the documentation.
