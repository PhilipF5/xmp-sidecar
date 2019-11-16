import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

export class XmpSidecar {
	public static async load(
		pathToFile: string,
		{
			createImmediately,
			fsModule,
			pathModule,
		}: { createImmediately?: boolean; fsModule?: typeof fs.promises; pathModule?: typeof path } = {},
	) {
		const object = new XmpSidecar(pathToFile, { fsModule, pathModule });
		let sidecarContents;
		try {
			sidecarContents = await object._fs.readFile(object.filePath);
		} catch {
			const defaultSidecar = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 4.4.0-Exiv2">
	<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
		<rdf:Description rdf:about="" xmlns:MicrosoftPhoto="http://ns.microsoft.com/photo/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:fstop="http://www.fstopapp.com/xmp/">
			<dc:subject>
				<rdf:Bag>
					<rdf:li></rdf:li>
				</rdf:Bag>
			</dc:subject>
		</rdf:Description>
	</rdf:RDF>
</x:xmpmeta>`;
			sidecarContents = defaultSidecar;
			createImmediately && (await object._fs.writeFile(object.filePath, defaultSidecar));
		}

		object._xml = await xml2js.parseStringPromise(sidecarContents);
		return object;
	}

	private _filePath: path.ParsedPath;
	private _fs: typeof fs.promises;
	private _path: typeof path;
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
		return this._path.format(this._filePath);
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

	constructor(pathToFile: string, modules?: { fsModule?: typeof fs.promises; pathModule?: typeof path }) {
		this._fs = modules?.fsModule ?? fs.promises;
		this._path = modules?.pathModule ?? path;
		this._filePath = this._path.parse(this._path.resolve(__dirname, pathToFile));
		this._filePath.base = this._filePath.base.replace(this._filePath.ext, ".xmp");
		this._filePath.ext = ".xmp";
	}

	public addTag(tag: string): string[] {
		if (!this.tags.includes(tag)) {
			this.tags = [...this.tags.filter((t) => !!t), tag];
		}
		return this.tags;
	}

	public addTags(tags: string[]): string[] {
		this.tags = [...this.tags.filter((t) => !!t), ...tags.filter((t) => !this.tags.includes(t))];
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

	public async save(filePath?: string): Promise<XmpSidecar> {
		let builder = new xml2js.Builder();
		if (filePath) {
			filePath = this._path.resolve(__dirname, filePath);
		}
		filePath = filePath || this._path.format(this._filePath);
		await this._fs.writeFile(filePath, builder.buildObject(this.rawXml));
		return XmpSidecar.load(filePath, { fsModule: this._fs, pathModule: this._path });
	}

	public setAttribute(name: string, value: string): any {
		this._descAttributes[name] = value;
		return this._descAttributes;
	}
}
