interface JsonSchema7 {
  $ref?: string;
  /**
   * This is important because it tells refs where
   * the root of the document is located
   */
  $id?: string;
  /**
   * It is recommended that the meta-schema is
   * included in the root of any JSON Schema
   */
  $schema?: string;
  /**
   * Title of the schema
   */
  title?: string;
  /**
   * Schema description
   */
  description?: string;
  /**
   * Default json for the object represented by
   * this schema
   */
  default?: any;
  /**
   * The value must be a multiple of the number
   * (e.g. 10 is a multiple of 5)
   */
  multipleOf?: number;
  maximum?: number;
  /**
   * If true maximum must be > value, >= otherwise
   */
  exclusiveMaximum?: number;
  minimum?: number;
  /**
   * If true minimum must be < value, <= otherwise
   */
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  /**
   * This is a regex string that the value must
   * conform to
   */
  pattern?: string;
  additionalItems?: boolean | JsonSchema7;
  items?: JsonSchema7 | JsonSchema7[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JsonSchema7;
  /**
   * Holds simple JSON Schema definitions for
   * referencing from elsewhere.
   */
  definitions?: {
    [key: string]: JsonSchema7;
  };
  /**
   * The keys that can exist on the object with the
   * json schema that should validate their value
   */
  properties?: {
    [property: string]: JsonSchema7;
  };
  /**
   * The key of this object is a regex for which
   * properties the schema applies to
   */
  patternProperties?: {
    [pattern: string]: JsonSchema7;
  };
  /**
   * If the key is present as a property then the
   * string of properties must also be present.
   * If the value is a JSON Schema then it must
   * also be valid for the object if the key is
   * present.
   */
  dependencies?: {
    [key: string]: JsonSchema7 | string[];
  };
  /**
   * Enumerates the values that this schema can be
   * e.g.
   * {"type": "string",
   *  "enum": ["red", "green", "blue"]}
   */
  enum?: any[];
  /**
   * The basic type of this schema, can be one of
   * [string, number, object, array, boolean, null]
   * or an array of the acceptable types
   */
  type?: string | string[];
  allOf?: JsonSchema7[];
  anyOf?: JsonSchema7[];
  oneOf?: JsonSchema7[];
  /**
   * The entity being validated must not match this schema
   */
  not?: JsonSchema7;
  format?: string;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: any[];
  contains?: JsonSchema7;
  propertyNames?: JsonSchema7;
  const?: any;
  if?: JsonSchema7;
  then?: JsonSchema7;
  else?: JsonSchema7;
  errorMessage?: any;
}

export interface JsonSchema4 {
  $ref?: string;
  /**
   * This is important because it tells refs where
   * the root of the document is located
   */
  id?: string;
  /**
   * It is recommended that the meta-schema is
   * included in the root of any JSON Schema
   */
  $schema?: string;
  /**
   * Title of the schema
   */
  title?: string;
  /**
   * Schema description
   */
  description?: string;
  /**
   * Default json for the object represented by
   * this schema
   */
  default?: any;
  /**
   * The value must be a multiple of the number
   * (e.g. 10 is a multiple of 5)
   */
  multipleOf?: number;
  maximum?: number;
  /**
   * If true maximum must be > value, >= otherwise
   */
  exclusiveMaximum?: boolean;
  minimum?: number;
  /**
   * If true minimum must be < value, <= otherwise
   */
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  /**
   * This is a regex string that the value must
   * conform to
   */
  pattern?: string;
  additionalItems?: boolean | JsonSchema4;
  items?: JsonSchema4 | JsonSchema4[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JsonSchema4;
  /**
   * Holds simple JSON Schema definitions for
   * referencing from elsewhere.
   */
  definitions?: {
    [key: string]: JsonSchema4;
  };
  /**
   * The keys that can exist on the object with the
   * json schema that should validate their value
   */
  properties?: {
    [property: string]: JsonSchema4;
  };
  /**
   * The key of this object is a regex for which
   * properties the schema applies to
   */
  patternProperties?: {
    [pattern: string]: JsonSchema4;
  };
  /**
   * If the key is present as a property then the
   * string of properties must also be present.
   * If the value is a JSON Schema then it must
   * also be valid for the object if the key is
   * present.
   */
  dependencies?: {
    [key: string]: JsonSchema4 | string[];
  };
  /**
   * Enumerates the values that this schema can be
   * e.g.
   * {"type": "string",
   *  "enum": ["red", "green", "blue"]}
   */
  enum?: any[];
  /**
   * The basic type of this schema, can be one of
   * [string, number, object, array, boolean, null]
   * or an array of the acceptable types
   */
  type?: string | string[];
  allOf?: JsonSchema4[];
  anyOf?: JsonSchema4[];
  oneOf?: JsonSchema4[];
  /**
   * The entity being validated must not match this schema
   */
  not?: JsonSchema4;
  format?: string;
  const?: any;
}

type JsonSchema = JsonSchema4 | JsonSchema7;

export default JsonSchema;
