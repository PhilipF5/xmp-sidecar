import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

export class XmpSidecar {
	public static load(pathToFile: string) {
		return new XmpSidecar(pathToFile);
	}

	private _filePath: path.ParsedPath;
	private _xml: any;

	private get _descAttributes(): any {
		return this._descObject.$;
	}

	private get _descObject(): any {
		return this.rawXml["x:xmpmeta"]["rdf:RDF"][0]["rdf:Description"][0];
	}

	private get _descTags(): any {
		return this._descObject["dc:subject"][0];
	}

	public get filePath(): string {
		return path.format(this._filePath);
	}

	public get name(): string {
		return this._filePath.name;
	}

	public get rating(): number {
		return Number(this._descAttributes["xmp:Rating"]);
	}

	public set rating(value: number) {
		this._descAttributes["xmp:Rating"] = String(value);
	}

	public get rawXml(): any {
		return this._xml;
	}

	public get tags(): string[] {
		return this._descTags["rdf:Bag"][0]["rdf:li"];
	}

	public set tags(value: string[]) {
		this._descTags["rdf:Bag"][0]["rdf:li"] = value;
	}

	constructor(pathToFile: string) {
		let filePath = path.resolve(__dirname, pathToFile);
		this._filePath = path.parse(filePath);
		this._filePath.base = this._filePath.base.replace(this._filePath.ext, ".xmp");
		this._filePath.ext = ".xmp";

		if (!fs.existsSync(this.filePath)) {
			throw new Error("XMP sidecar not found at: " + this.filePath);
		}

		xml2js.parseString(fs.readFileSync(this.filePath), (err, result) => {
			this._xml = result;
		});
	}

	public addTag(tag: string): string[] {
		if (!this.tags.includes(tag)) {
			this.tags.push(tag);
		}
		return this.tags;
	}

	public getAttribute(name: string): string {
		return this._descAttributes[name];
	}

	public hasAttribute(name: string): boolean {
		return this._descAttributes[name] !== undefined;
	}

	public hasTag(tag: string): boolean {
		return this.tags.includes(tag);
	}

	public removeAttribute(name: string): any {
		delete this._descAttributes[name];
		return this._descAttributes;
	}

	public removeTag(tag: string): string[] {
		this.tags = this.tags.filter((item) => item !== tag);
		return this.tags;
	}

	public save(filePath?: string): XmpSidecar {
		let builder = new xml2js.Builder();
		if (filePath) {
			filePath = path.resolve(__dirname, filePath);
		}
		filePath = filePath || path.format(this._filePath);
		fs.writeFileSync(filePath, builder.buildObject(this.rawXml));
		return new XmpSidecar(filePath);
	}

	public setAttribute(name: string, value: string): any {
		this._descAttributes[name] = value;
		return this._descAttributes;
	}
}
