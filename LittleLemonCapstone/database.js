import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key autoincrement, name text, price real, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    menuItems.forEach((item) => {
      tx.executeSql(
        'INSERT INTO menuitems (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.description, item.price, item.image, item.category],
        (_, { rowsAffected }) => {
          console.log(`Rows affected: ${rowsAffected}`);
        },
        (_, error) => {
          console.error('Error saving menu items:', error);
        }
      );
    });
  });
};

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    let sqlQuery = '';
    if (!query) {
      if (activeCategories.length > 0) {
        sqlQuery = `select * from menuitems where ${activeCategories
          .map((category) => `category='${category}'`)
          .join(' or ')}`;
      } else {
        sqlQuery = 'select * from menuitems';
      }
    } else {
      if (activeCategories.length > 0) {
        sqlQuery = `select * from menuitems where (name like '%${query}%') and (${activeCategories
          .map((category) => `category='${category}'`)
          .join(' or ')})`;
      } else {
        sqlQuery = `select * from menuitems where name like '%${query}%'`;
      }
    }

    db.transaction((tx) => {
      tx.executeSql(
        sqlQuery,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};