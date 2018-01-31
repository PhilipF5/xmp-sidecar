import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

export class XmpSidecar {
	private _filePath: path.ParsedPath;
	private _id: string;
	private _xml: any;

	public get filePath(): string {
		return path.format(this._filePath);
	}

	public get id(): string {
		return this._id;
	}

	public get name(): string {
		return this._filePath.name;
	}

	public get rawXml(): any {
		return this._xml;
	}

	constructor(pathToFile: string) {
		let filePath = path.resolve(__dirname, pathToFile);
		this._filePath = path.parse(filePath);
		this._filePath.ext = ".xmp";

		if (!fs.existsSync(this.filePath)) {
			throw new Error("XMP sidecar not found at: " + this.filePath);
		}

		xml2js.parseString(fs.readFileSync(this.filePath), (err, result) => {
			this._xml = result;
		});
	}
}
