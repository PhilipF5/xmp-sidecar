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
		expect(obj.tags.includes("google stuff")).to.be.true;
		expect(obj.tags.includes("computer")).to.be.true;
		expect(obj.tags.includes("home")).to.be.true;
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
		expect(obj.tags.includes("tardis")).to.be.true;
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
		expect(obj.tags.includes("google stuff")).to.be.false;
	});
});

describe("Static methods", () => {
	it("should initialize new XmpSidecar object from file", () => {
		const obj = XmpSidecar.load("../test.xmp");
		expect(obj).to.not.be.null;
	});
});
