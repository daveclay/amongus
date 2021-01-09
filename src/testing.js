/************************************************
 * Testing
 ************************************************/
const shallowEquals = (object1, object2) => {
  if (object1 === null || object1 === undefined) {
    if (object2 === null || object1 === undefined) {
      return true;
    }

    return false;
  }

  if (typeof object1 == 'object') {
    if (typeof object2 == 'object') {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          return false;
        }
      }
    } else {
      return false;
    }
  } else {
    if (typeof object2 == 'object') {
      return false;
    } else {
      return object1 == object2;
    }
  }

  return true;
}

export const expect = (obj) => {
  return {
    to_equal(expected) {
      if (!shallowEquals(obj, expected)) {
        throw `${JSON.stringify(obj)} did not equal ${JSON.stringify(expected)}`;
      }
    }
  }
}

export const describe = (fnObjOrDesc, block) => {
  let name = typeof fnObjOrDesc === "function" ? fnObjOrDesc.name : fnObjOrDesc
  console.log(`testing: ${name}`)
  block()
  console.log("pass!")
}
