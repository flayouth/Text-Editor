import { openDB } from 'idb';

const initdb = async () => {
  const db = await openDB('jate', 1);

  if (!db.objectStoreNames.contains('jate')) {
    db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
    console.log('jate database created');
  } else {
    console.log('jate database already exists');
  }
};

export const putDb = async (content) => {
  console.log('POST to the jate');

  const db = await openDB('jate', 1);
  const tx = db.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put({ value: content });

  const result = await request;
  console.log('🚀 - data saved to the database', result);
};

export const getDb = async () => {
  console.log('GET all from the database');

  const db = await openDB('jate', 1);
  const tx = db.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.get(1);

  const result = await request;
  console.log('result.value', result);
  return result?.value;
};

initdb();

