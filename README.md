# XMP Sidecars for Node.js
Provides an API for working with XMP sidecar files used to store metadata for images and videos.

## Usage
### Create an object from existing sidecar
#### TypeScript
```ts
let mySidecar = new XmpSidecar("relative/path/to/file.jpg");
```
#### JavaScript
```js
var mySidecar = XmpSidecar.load("relative/path/to/file.jpg");
```
You can also use the path to the `.xmp` file itself.

### Members
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
|`save()`|`XmpSidecar`|Save the sidecar contents to the file it was created from|
|`save(path)`|`XmpSidecar`|Save the sidecar contents to a specified file path|
|`setAttribute(name, value)`|array|Set an XMP description attribute with the given name to the given value|
