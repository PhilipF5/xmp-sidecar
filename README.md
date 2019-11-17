# XMP Sidecars for Node.js
Provides an API for working with XMP sidecar files used to store metadata for images and videos.

## Installation
`.npmrc`:
```
@philipf5:registry=https://npm.pkg.github.com
```

Shell:
```
$ npm install @philipf5/xmp-sidecar
```

## Usage
### Initialization
```js
import { XmpSidecar } from "@philipf5/xmp-sidecar";
// ...
let mySidecar = await XmpSidecar.load("relative/path/to/image.jpg");
```
You can also use the path to the `.xmp` file itself, if it already exists. If you use the image path, it's expected that the `.xmp` should use the same file name as the image (e.g., `IMG_0001.png` has sidecar `IMG_0001.xmp`);

The `load()` method also can take a second parameter, which takes an object with zero or more of the following properties:
```ts
{
	createImmediately: boolean,
	fsModule: typeof fs.promises,
	pathModule: typeof path,
}
```

`createImmediately` will cause an XMP file to be created for an image immediately on load if it does not already exist. Without this option, the default behavior is to only create the file on `save()`, which is generally going to be better for bulk or interactive operations.

`fsModule` allows you to pass in your own `fs.promises` if your code is running in an environment where the built-in `import * as fs from "fs";` isn't going to work, such as the renderer process of an Electron app. Note that you have to pass `fs.promises`, not just `fs`.

`pathModule` is the same concept as `fsModule`, but for `path`. Again, the use case is Electron or any other environment where built-in Node modules cannot just be `import`ed normally.

### Other Members
|Name|Type|Description|
|----|----|-------|
|`filePath`|string|Get path to the `.xmp` file|
|`name`|string|Get name of the media file and its sidecar|
|`rating`|number|Get or set integer rating value (1-5 scale)|
|`rawXml`|object|Get the raw XML object representing the sidecar contents|
|`tags`|array|Get an editable string array of tags, or set it to a new array|
|`addTag(tag)`|array|Add a tag to the sidecar|
|`getAttribute(name)`|string|Get the value of an XMP description attribute with a given name|
|`hasAttribute(name)`|boolean|Check if the XMP description has an attribute with a given name|
|`hasTag(tag)`|boolean|Check if the XMP tags list includes a given tag|
|`removeAttribute(name)`|array|Remove the XMP description attribute with a given name|
|`removeTag(tag)`|array|Remove the given tag from the tags list|
|`save()`|`Promise<XmpSidecar>`|Save the sidecar contents to the file it was created from|
|`save(path)`|`Promise<XmpSidecar>`|Save the sidecar contents to a specified file path|
|`setAttribute(name, value)`|array|Set an XMP description attribute with the given name to the given value|
