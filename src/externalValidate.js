import { execSync } from 'node:child_process';
import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
import Clc from 'cli-color';


// important paths
// https://stackoverflow.com/a/55944697/1169798
const PATH_ROOT = Path.resolve( Path.dirname( fileURLToPath(import.meta.url) ), '..' );
const PATH_TEST = Path.join( PATH_ROOT, 'tests' );
const PATH_TEST_VALID = Path.join( PATH_TEST, 'valid' );
const PATH_TEST_INVALID = Path.join( PATH_TEST, 'invalid' );
const PATH_SHACL = Path.join( PATH_ROOT, 'shacl', 'iadopt.sh.ttl' );


// scan for RDF files
for( const [ type, path ] of [ ['VALID', PATH_TEST_VALID], ['INVALID', PATH_TEST_INVALID] ]) {

  console.log( `\n================= ${type} =================\n` );
  for await(const rawFilePath of Fs.glob( '**/*.ttl', { cwd: path} ) ) {
    console.log( Clc.bold(`${rawFilePath}`) );

    // load data file
    const filepath = Path.join( path, rawFilePath );

    // run external SHACL validator
    // https://github.com/ISAITB/shacl-validator?tab=readme-ov-file
    // https://www.itb.ec.europa.eu/docs/guides/latest/validatingRDF/
    const command = [
      'java -jar ./validator.jar ',
      `-contentToValidate ${filepath}`,
      `-externalShapes ${PATH_SHACL}`,
      '-reportSyntax application/ld+json',
      '-nooutput',
      '-clireports'
    ].join( ' ' );
    const raw = execSync( command, { cwd: PATH_ROOT, } ).toString();
    const result = JSON.parse( raw );

    // log
    if( result?.['sh:conforms']?.['@value'] === 'true' ) {
      console.log( Clc[ path == PATH_TEST_VALID ? 'green' : 'red' ]( '   valid' ) );
    } else {
      console.log(
        result?.['@graph']?.map( (el) => el['sh:resultMessage'] )
          .filter( (el) => el )
          .map( (el) => Clc[ path == PATH_TEST_VALID ? 'red' : 'green' ]( `   ${el}` ) )
          .join( '\n' )
      );
    }
  }
}