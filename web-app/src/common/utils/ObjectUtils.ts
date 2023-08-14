/**
 * @recursive
 * @param {Object.<string, any>} before
 * @param {Object.<string, any>} after
 * @returns {Object.<string, any>}
 */
export function createChangeSet(
  before: { [key: string]: any } = {},
  after: { [key: string]: any } = {},
): { [key: string]: any } {
  // combine keys to iterate over
  const keysToIterate = Object.keys({ ...before, ...after });

  // create a changeSet of the two objects
  const changeSet: { [key: string]: any } = {};

  // iterate over the keys
  // recurse if either value is a nested object
  keysToIterate.forEach((key) => {
    const isRecursionRequired =
      validateObject(before[key]) || validateObject(after[key]);
    if (isRecursionRequired) {
      const resursiveChangeSet = createChangeSet(before[key], after[key]);
      if (Object.keys(resursiveChangeSet).length > 0) {
        changeSet[key] = { ...resursiveChangeSet };
      }
    }

    // if the values are not string equivalent, add them to the changeSet
    else {
      const newString = String(before[key]);
      const oldString = String(after[key]);
      if (newString !== oldString) {
        changeSet[key] = {};
        if (newString !== 'undefined') {
          changeSet[key].new = before[key];
        }
        if (oldString !== 'undefined') {
          changeSet[key].old = after[key];
        }
      }
    }
  });
  return changeSet;
}

/**
 * @recursive
 * @param {Object.<string, any>} object
 * @returns {number}
 */
export function deepEntriesCount(object: { [key: string]: any } = {}): number {
  // determine keys to iterate over
  const keysToIterate = Object.keys(object);

  // create a entry count of the object's keys
  let entriesCount = Number(0);

  // iterate over the keys, mapping them to a count of their entries
  keysToIterate
    .map((key) => {
      if (validateObject(object[key])) {
        return deepEntriesCount(object[key]);
      } else {
        return Number(1);
      }
    })
    .forEach((count) => (entriesCount += count));
  return entriesCount;
}

/**
 * @recursive
 * @param {Object.<string, any>} object
 * @param {string[]} keysToFilter
 * @param {boolean} isWhitelist
 * @returns {Object.<string, any>}
 */
export function deepFilterKeys(
  object: { [key: string]: any } = {},
  keysToFilter: string[] = [],
  isWhitelist: boolean = true,
): { [key: string]: any } {
  // determine keys to iterate over
  const keys = Object.keys(object);
  const keysToIterate = isWhitelist
    ? keys.filter((key) => keysToFilter.includes(key))
    : keys.filter((key) => !keysToFilter.includes(key));

  // create a filtered object
  const filteredObject: { [key: string]: any } = {};

  // iterate over the keys, adding them to the filtered object
  keysToIterate.forEach((key) => {
    if (validateObject(object[key])) {
      filteredObject[key] = deepFilterKeys(
        object[key],
        keysToFilter,
        isWhitelist,
      );
    } else {
      filteredObject[key] = object[key];
    }
  });
  return filteredObject;
}

/**
 * @recursive
 * @param {Object.<string, any>} object
 * @param {any[]} valuesToFilter
 * @param {boolean} isWhitelist
 * @returns {Object.<string, any>}
 */
export function deepFilterValues(
  object: { [key: string]: any } = {},
  valuesToFilter: any[] = [],
  isWhitelist: boolean = true,
): { [key: string]: any } {
  // determine values to iterate over in the object
  const keysToIterate = Object.keys(object);

  // create a filtered object
  const filteredObject: { [key: string]: any } = {};

  // iterate over the keys, adding their value pairs to the filtered object
  keysToIterate.forEach((key) => {
    if (validateObject(object[key])) {
      const deepValues = deepFilterValues(
        object[key],
        valuesToFilter,
        isWhitelist,
      );
      if (Object.keys(deepValues).length > 0) {
        filteredObject[key] = deepValues;
      }
    } else if (
      (isWhitelist && valuesToFilter.includes(object[key])) ||
      (!isWhitelist && !valuesToFilter.includes(object[key]))
    ) {
      filteredObject[key] = object[key];
    }
  });
  return filteredObject;
}

/**
 * @recursive
 * @param {Object.<string, any>} object
 * @param {boolean} ignoreDuplicates
 * @returns {any[]}
 */
export function deepValues(
  object: { [key: string]: any } = {},
  ignoreDuplicates: boolean = false,
): any[] {
  // determine keys to iterate over
  const keysToIterate = Object.keys(object);

  // create a values array
  const values: any[] = [];

  // iterate over the keys, tracking corresponding values
  keysToIterate.forEach((key) => {
    if (validateObject(object[key])) {
      deepValues(object[key], ignoreDuplicates).forEach((value) =>
        values.push(value),
      );
    } else {
      values.push(object[key]);
    }
  });

  // ignore duplicates if specified
  return ignoreDuplicates ? Array.from(new Set(values)) : values;
}

/**
 * @recursive
 * @param {Object.<string, any>} object
 * @param {string} delimiter
 * @returns {Object.<string, any>}
 * @throws {Error} if the delimiter specified is not allowed
 * Allowed delimiters are: .!@#$%^&*-_=+|~
 * (see FLATTEN_DELIMITERS_ALLOWED)
 */
export function flatten(
  object: { [key: string]: any } = {},
  delimiter: string = String('.'),
): { [key: string]: any } {
  if (!FLATTEN_DELIMITERS_ALLOWED.includes(delimiter)) {
    const delimiters = FLATTEN_DELIMITERS_ALLOWED.join('');
    throw new Error(
      `[ObjectUtils] flatten() - delimiter must be one of the following characters: "${delimiters}"`,
    );
  }

  // determine keys to iterate over
  const keysToIterate = Object.keys(object);

  // create a flattened object
  const flattenedObject: { [key: string]: any } = {};

  // iterate over the keys, adding them to the flattened object
  keysToIterate.forEach((key) => {
    if (validateObject(object[key])) {
      const flattenedValue = flatten(object[key], delimiter);
      Object.keys(flattenedValue).forEach((flattenedKey) => {
        const delimitedKey = String(`${key}${delimiter}${flattenedKey}`);
        flattenedObject[delimitedKey] = flattenedValue[flattenedKey];
      });
    } else {
      flattenedObject[key] = object[key];
    }
  });
  return flattenedObject;
}

/**
 * @param {any} value
 * @returns {Boolean} isValid
 */
export function validateObject(value: any): boolean {
  try {
    return (
      value !== null &&
      value !== undefined &&
      value instanceof Object &&
      String(value) !== String('null') &&
      String(value) !== String('undefined') &&
      String(value) === String('[object Object]')
    );
  } catch {
    return Boolean(false);
  }
}

export const FLATTEN_DELIMITERS_ALLOWED = [
  '.',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '-',
  '_',
  '=',
  '+',
  '|',
  '~',
];
