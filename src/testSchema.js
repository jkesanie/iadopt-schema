import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import Clc from 'cli-color';

// important paths
// https://stackoverflow.com/a/55944697/1169798
const PATH_ROOT = Path.resolve( Path.dirname( fileURLToPath(import.meta.url) ), '..' );
const PATH_SCHEMA = Path.join( PATH_ROOT, 'json', 'Variable.schema.json' );
const PATH_TEST = Path.join( PATH_ROOT, 'tests' );
const PATH_TEST_VALID = Path.join( PATH_TEST, 'valid' );
const PATH_TEST_INVALID = Path.join( PATH_TEST, 'invalid' );

// load JSON schema
const schema = JSON.parse( await Fs.readFile( PATH_SCHEMA ) );
const ajv = new Ajv({ strict:false });
const validator = ajv.compile( schema );

// check examples
for( const [ type, path ] of [ ['VALID', PATH_TEST_VALID], ['INVALID', PATH_TEST_INVALID] ]) {

  console.log( `\n================= ${type} =================\n` );
  for await(const rawFilePath of Fs.glob( '**/*.jsonld', { cwd: path} ) ) {
    try {
      console.log( Clc.bold(`${rawFilePath}`) );

      // load data file
      const filepath = Path.join( path, rawFilePath );
      const data = JSON.parse( await Fs.readFile( filepath ) );

      // run validation
      const res = validator( data );

      // log
      if( res ) {
        console.log( Clc[ path == PATH_TEST_VALID ? 'green' : 'red' ]( '   valid' ) );
      } else {
        for( const e of validator.errors ) {
          console.log( Clc[ path == PATH_TEST_VALID ? 'red' : 'green' ]( `   ${e.message} | ${JSON.stringify( e )}` ) );
        }
      }

    } catch( e ) {
      console.error( e );
    }

  }

}
