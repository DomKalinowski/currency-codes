import { XMLParser } from "fast-xml-parser";

/**
 * NOTE: This fork is meant to satisfy the needs of the private project.
 * but feel free to use it as a starting point for your own projects under
 * the MIT License and Public Domain license compatible with the forked version.
 *
 * The purpose of this script is to create a full list of currencies
 * defined by ISO 4217 disregarding the countries.
 * In case you need the country data that includes the currency codes
 * check the following repository:
 * https://github.com/datasets/country-codes
 */
const ISO_CURRENCY_LIST_ONE =
    "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml";
const listOne = await (await fetch(ISO_CURRENCY_LIST_ONE)).text();

const parser = new XMLParser();
const xml = parser.parse(listOne);

type CurrencyDictionary = Record<
    string,
    {
        iso_4217_alpha: string;
        iso_4217_numeric: string;
        minor_unit: string;
        name: string;
    }
>;

const currencies: CurrencyDictionary = Object.create(null);

for (const currency of xml.ISO_4217.CcyTbl.CcyNtry) {
    const { CcyNm, Ccy, CcyNbr, CcyMnrUnts } = currency;
    if (!currencies[Ccy] && Ccy !== undefined) {
        currencies[Ccy] = {
            iso_4217_alpha: Ccy,
            iso_4217_numeric: CcyNbr,
            minor_unit: CcyMnrUnts,
            name: CcyNm,
        };
    }
}

const OUTPUT_FILE_PATH = "./data/currencies.json";
await Bun.write(OUTPUT_FILE_PATH, JSON.stringify(currencies, null, 2));
