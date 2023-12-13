import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, name text, description text, price text, category text);'
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
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    const values = menuItems
      .map(
        (item) =>
          `('${item.id}', '${item.name}', '${item.description}', '${item.price}', '${item.category}')`
      )
      .join(', ');

    tx.executeSql(
      `insert into menuitems (id, name, description, price, category) values ${values};`
    );
  });
  };


export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    const categoryConditions = activeCategories.map(
      (category) => `category = ?`
    );

    const queryString = `%${query}%`;

    const sql = `
      SELECT * FROM menuitems
      WHERE title LIKE ? AND (${categoryConditions.join(' OR ')});
    `;

    const params = [queryString, ...activeCategories];

    db.transaction((tx) => {
      tx.executeSql(sql, params, (_, { rows }) => {
        const filteredItems = rows._array;
        resolve(filteredItems);
      });
    });
  });
}
