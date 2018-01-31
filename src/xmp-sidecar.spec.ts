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
