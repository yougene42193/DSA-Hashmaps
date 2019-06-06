'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || slot.key == key) {
        return index;
      }
    }
  }
  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    this.length = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined) {
        this.set(slot.key, slot.value);
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function containsKey(hashMap, key) {
  for (let i = 0; i < hashMap._slots.length; i++) {
    if (hashMap.get(key)) {
      return true;
    }
  }
  return false;
}

function permutation(string) {
  let oddChar = false;
  let hm = new HashMap();
  for (let i = 0; i < string.length; i++) {
    if(containsKey(hm, string[i])) {
      let value = hm.get(string[i]);
      hm.set(string[i], (value + 1))
    } else {
      hm.set(string[i], 1);
    }
  }
  for (let i = 0; i < hm._slots.length; i++) {
    for (let keys in hm._slots[i]) {
      if (hm._slots[i][keys]& 1) {
        if (oddChar) {
          return false;
        }
        oddChar = true;
      }
    }
  }
  return true;
}

function getHashedAnagram(arr) {
  const anagrams = new HashMap();
  const result = [];
  const different = [];
  for (let i = 0; i < arr.length; i++) {
    let sortedLetters = arr[i].split('').sort().join('');
    try {
      anagrams.set(sortedLetters, [...anagrams.get(sortedLetters), arr[i]]);
    } catch(err) {
      different.push(sortedLetters);
      anagrams.set(sortedLetters, [arr[i]]);
    }
  }
  for (let i = 0; i < different.length; i++) {
    result.push(anagrams.get(different[i]));
  }
  return result;
}

console.log(getHashedAnagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']))

function main() {
  let lor = new HashMap();
  lor.set('Hobbit', 'Bilbo');
  lor.set('Hobbit', 'Frodo');
  lor.set('Wizard', 'Gandolf');
  lor.set('Human', 'Aragon');
  lor.set('Elf', 'Legolas');
  lor.set('Maiar', 'The Necromancer');
  lor.set('Maiar', 'Sauron');
  lor.set('RingBearer', 'Gollum');
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
}
main();