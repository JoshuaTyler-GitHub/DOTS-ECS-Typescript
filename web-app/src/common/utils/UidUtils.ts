/**
 * @constants
 */
const SERIAL_VERSION_UID_REGEX = RegExp(/^[1-8]\d{19}$/); // prettier-ignore
const UUID_V4_REGEX = RegExp(/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i); // prettier-ignore

/**
 * Populate a Java-esque pseudo-random SerialVersionUid
 * from 20 digits, where the first digit is restricted
 * to a maximum of 8 due to being of type long.
 * @see https://docs.oracle.com/en/java/javase/19/docs/api/java.base/java/io/Serializable.html
 * @returns {string}
 */
export function serialVersionUID(): string {
  const id = Array(19)
    .fill(0)
    .map(() => {
      return Math.floor(Math.random() * 10);
    });
  id[0] = Math.max(1, Math.min(8, id[0]));
  return id.join('');
}

/**
 * Generate a UUID v4.
 * @see {uuidV4}
 * @returns {string}
 */
export function uid(): string {
  return uuidV4();
}

/**
 * Paraphrased from RFC 4122:
 * UUID =
 *  time-low "-"
 *  time-mid "-"
 *  time-high-and-version "-"
 *  clock-seq-and-reserved
 *  clock-seq-low "-"
 *  node
 *
 * where:
 *  time-low               = 4hexOctet
 *  time-mid               = 2hexOctet
 *  time-high-and-version  = 2hexOctet
 *  clock-seq-and-reserved = hexOctet
 *  clock-seq-low          = hexOctet
 *  node                   = 6hexOctet
 *  hexOctet               = hexDigit hexDigit
 *  hexDigit =
 *        "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
 *        "a" / "b" / "c" / "d" / "e" / "f" /
 *        "A" / "B" / "C" / "D" / "E" / "F"
 * The version 4 UUID is meant for generating UUIDs from truly-random or
 * pseudo-random numbers.
 *
 * The algorithm is as follows:
 * -  Set the two most significant bits (bits 6 and 7) of the
 *    clock-seq-and-reserved to zero and one, respectively.
 * -  Set the four most significant bits (bits 12 through 15) of the
 *    time-high-and-version field to 0100
 * -  Set all the other bits to randomly (or pseudo-randomly) chosen
 *    values.
 * @see https://www.rfc-editor.org/rfc/rfc4122
 * @return {string}
 */
export function uuidV4(): string {
  const uuid = new Array(36).fill(0).map(() => {
    return Math.floor(Math.random() * 16);
  });
  // set bits 12-15 of time-high-and-version to 0100
  uuid[14] = 4;

  // set bit 6 of clock-seq-and-reserved to zero
  uuid[19] = uuid[19] &= ~(1 << 2);

  // set bit 7 of clock-seq-and-reserved to one
  uuid[19] = uuid[19] |= 1 << 3;

  // join the array into a string with dashes
  return uuid
    .map((x, i) => {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        return '-';
      } else {
        return x.toString(16);
      }
    })
    .join('');
}

/**
 * @param {string} uuid
 * @returns {boolean}
 */
export function validateSerialVersionUID(uuid: string): boolean {
  try {
    return SERIAL_VERSION_UID_REGEX.test(uuid);
  } catch {
    return false;
  }
}

/**
 * @param {string} uuid
 * @returns {boolean}
 */
export function validateUuidv4(uuid: string): boolean {
  try {
    return UUID_V4_REGEX.test(uuid);
  } catch {
    return false;
  }
}
