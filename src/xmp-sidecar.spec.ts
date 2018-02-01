import { expect } from "chai";
import "mocha";
import { XmpSidecar } from "./xmp-sidecar";

describe("XmpSidecar constructor", () => {
	const obj = new XmpSidecar("../test.xmp");
	it("should succeed when the file is an XMP", () => {
		expect(() => { new XmpSidecar("../test.xmp"); }).to.not.throw();
	});
	it("should succeed when the file has an XMP sidecar", () => {
		expect(() => { new XmpSidecar("../test.jpg"); }).to.not.throw();
	});
	it("should have the name 'test'", () => {
		expect(obj.name).to.equal("test");
	});
	it("should have the rawXml property", () => {
		expect(obj.rawXml).to.not.be.null;
	});
	it("should have an XML type of 'x:xmpmeta'", () => {
		expect(obj.rawXml["x:xmpmeta"]).to.not.be.undefined;
	});
	it("should throw when the file can't be found", () => {
		expect(() => { new XmpSidecar("fake-file.xmp"); }).to.throw();
	});
});

describe("Property getters", () => {
	const obj = new XmpSidecar("../test.xmp");
	it("should have a rating of 4", () => {
		expect(obj.rating).to.equal(4);
	});
	it("should have the tags 'google stuff', 'computer', 'home'", () => {
		expect(obj.hasTag("google stuff")).to.be.true;
		expect(obj.hasTag("computer")).to.be.true;
		expect(obj.hasTag("home")).to.be.true;
	});
});

describe("Property setters", () => {
	const obj = new XmpSidecar("../test.xmp");
	it("should change the rating to 2", () => {
		obj.rating = 2;
		expect(obj.rating).to.equal(2);
	});
	it("should add the tag 'tardis'", () => {
		obj.addTag("tardis");
		expect(obj.hasTag("tardis")).to.be.true;
	});
	it("should not duplicate the tag 'home'", () => {
		obj.addTag("home");
		let count = 0;
		obj.tags.forEach((item) => {
			if (item === "home") {
				count++;
			}
		});
		expect(count).to.equal(1);
	});
	it("should remove the tag 'google stuff'", () => {
		obj.removeTag("google stuff");
		expect(obj.hasTag("google stuff")).to.be.false;
	});
});

describe("Static methods", () => {
	it("should initialize new XmpSidecar object from file", () => {
		const obj = XmpSidecar.load("../test.xmp");
		expect(obj).to.not.be.null;
	});
});

describe("Instance methods", () => {
	it("should make changes and then save a copy", () => {
		const obj = new XmpSidecar("../test.xmp");
		obj.rating = 3;
		obj.addTag("space");
		obj.setAttribute("example", "an example attr");
		const obj2 = obj.save("../test2.xmp");
		expect(obj2.rating).to.equal(3);
		expect(obj.hasTag("space")).to.be.true;
		expect(obj.getAttribute("example")).to.equal("an example attr");
	});
	it("should make changes and then save in-place", () => {
		const obj = new XmpSidecar("../test2.xmp");
		obj.rating = 4;
		obj.removeTag("space");
		obj.removeAttribute("example");
		const obj2 = obj.save();
		expect(obj2.rating).to.equal(4);
		expect(obj.hasTag("space")).to.be.false;
		expect(obj.hasAttribute("example")).to.be.false;
	});
});
