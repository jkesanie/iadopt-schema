# I-Adopt

This is the development repo for validations to the [I-Adopt framework](https://w3id.org/iadopt/).
It contains

* [SHACL shapes](./shacl/iadopt.sh.ttl)
* JSON-LD context
  * [Variable](./json/context.jsonld)
* JSON schema
  * [Variable](./json/schema.json)

and a few testing tools.

See [`tests/valid`](./tests/valid/) for valid examples for JSON-LD-encoded Variables.

## Covered Requirements

**Variable**

| Requirement                                                      | SHACL | JSON-Schema |
|------------------------------------------------------------------|:-----:|:-----------:|
| `Variable` needs to have an identifier.                          |   ✗   |      ✓      |
| `Variable` needs to have exactly one `Property`.                 |   ✓   |      ✓      |
| `Variable` needs to have exactly one `ObjectOfInterest`.         |   ✓   |      ✓      |
| `Variable` can have up to one `Matrix`.                          |   ✓   |      ✓      |
| All `ContextObject`s of a `Variable` have to be concepts.        |   ✓   |      ✓      |
| All `Constraint`s of a `Variable` have to be concepts.           |   ✓   |      ✓      |
| All `Constraints` of a `Variable` have to be classified as such. |   ✓   |      ✓      |

**Constraint**

| Requirement                                                                            | SHACL | JSON-Schema |
|----------------------------------------------------------------------------------------|:-----:|:-----------:|
| `Constraint` needs to be linked from at least one `Variable`.                          |   ✓   |      ✓      |
| `Constraint` needs to constrain at least one entity.                                   |   ✓   |      ✓      |
| `Constraint`s of a `Variable` need to constraint only entities of the same `Variable`. |   ✓   |      ✗      |

## JSON-LD & JSON-Schema

The JSON-LD schema defines the following aliases for properties as a shorthand:

* `ooi` == `objectofinterest`
* `context` == `contextobject`

## Run

* Test JSON schema: `npm run schema`
* Test SHACL shapes (without SPARQL restrictions): `npm run shacl`
* Test SHACL shapes (with SPARQL restrictions): `npm run validate`
  * requires [ISAITB/shacl-validator](https://github.com/ISAITB/shacl-validator) to be present as `validator.jar` in the root folder and Java available
