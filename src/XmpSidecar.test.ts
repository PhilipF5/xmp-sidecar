import { XmpSidecar } from "./XmpSidecar";

const testFile1 = "../test/test-1.xmp";
const testFile2 = "../test/test-2.xmp";

describe("XmpSidecar constructor", () => {
	test("should succeed when the file is an XMP", () => {
		expect(async () => {
			await XmpSidecar.load(testFile1);
		}).not.toThrow();
	});
	test("should succeed when the file has an XMP sidecar", () => {
		expect(async () => {
			await XmpSidecar.load(testFile1.replace(".xmp", ".jpg"));
		}).not.toThrow();
	});
	test("should have the name 'test-1'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj.name).toEqual("test-1");
	});
	test("should have the rawXml property", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj.rawXml).not.toBeNull();
	});
	test("should have an XML type of 'x:xmpmeta'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj.rawXml["x:xmpmeta"]).not.toBeUndefined();
	});
	test("should throw when the file can't be found", () => {
		expect(async () => {
			await XmpSidecar.load("fake-file.xmp");
		}).toThrow();
	});
});

describe("Property getters", () => {
	test("should have a rating of 4", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj.rating).toEqual(4);
	});
	test("should have the tags 'google stuff', 'computer', 'home'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj.hasTag("google stuff")).toBeTruthy();
		expect(obj.hasTag("computer")).toBeTruthy();
		expect(obj.hasTag("home")).toBeTruthy();
	});
});

describe("Property setters", () => {
	test("should change the rating to 2", async () => {
		const obj = await XmpSidecar.load(testFile1);
		obj.rating = 2;
		expect(obj.rating).toEqual(2);
	});
	test("should add the tag 'tardis'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		obj.addTag("tardis");
		expect(obj.hasTag("tardis")).toBeTruthy();
	});
	test("should not duplicate the tag 'home'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		obj.addTag("home");
		let count = 0;
		obj.tags.forEach((item) => {
			if (item === "home") {
				count++;
			}
		});
		expect(count).toEqual(1);
	});
	test("should remove the tag 'google stuff'", async () => {
		const obj = await XmpSidecar.load(testFile1);
		obj.removeTag("google stuff");
		expect(obj.hasTag("google stuff")).toBeFalsy();
	});
});

describe("Static methods", () => {
	test("should initialize new XmpSidecar object from file", async () => {
		const obj = await XmpSidecar.load(testFile1);
		expect(obj).not.toBeNull();
	});
});

describe("Instance methods", () => {
	test("should make changes and then save a copy", async () => {
		const obj = await XmpSidecar.load(testFile1);
		obj.rating = 3;
		obj.addTag("space");
		obj.setAttribute("example", "an example attr");
		const obj2 = await obj.save(testFile2);
		expect(obj2.rating).toEqual(3);
		expect(obj.hasTag("space")).toBeTruthy();
		expect(obj.getAttribute("example")).toEqual("an example attr");
	});
	test("should make changes and then save in-place", async () => {
		const obj = await XmpSidecar.load(testFile2);
		obj.rating = 4;
		obj.removeTag("space");
		obj.removeAttribute("example");
		const obj2 = await obj.save();
		expect(obj2.rating).toEqual(4);
		expect(obj.hasTag("space")).toBeFalsy();
		expect(obj.hasAttribute("example")).toBeFalsy();
	});
});
