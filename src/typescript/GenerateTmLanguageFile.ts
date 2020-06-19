"use strict";

import * as fs from 'fs';
import * as Ajv from 'ajv';
import { cloveTmLanguage } from "./clove.tmLanguage";

let schema = fs.readFileSync('./src/schemas/tmlanguage.json').toString();

var ajv = new Ajv({verbose: true});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

var validate = ajv.compile(JSON.parse(schema));
var valid = validate(cloveTmLanguage);
if (!valid) { 
    console.error("The were validation errors.\n");
    console.error(validate.errors);
} else {
    console.log(JSON.stringify(cloveTmLanguage));
}




