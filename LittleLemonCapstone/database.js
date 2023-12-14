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
}



// export async function filterByQueryAndCategories(query, activeCategories) {
//   return new Promise((resolve, reject) => {
//     if (!query) {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `select * from menuitems where ${activeCategories
//             .map((category) => `category='${category}'`)
//             .join(' or ')}`,
//           [],
//           (_, { rows }) => {
//             resolve(rows._array);
//           }
//         );
//       }, reject);
//     } else {
//       db.transaction((tx) => {
//         tx.executeSql(
//           `select * from menuitems where (name like '%${query}%') and (${activeCategories
//             .map((category) => `category='${category}'`)
//             .join(' or ')})`,
//           [],
//           (_, { rows }) => {
//             resolve(rows._array);
//           }
//         );
//       }, reject);
//     }
//   });
// }

// export async function filterByQueryAndCategories(query, activeCategories) {
//   return new Promise((resolve, reject) => {
//     const categoryConditions = activeCategories.map(() => 'category = ?');

//     const queryString = `%${query}%`;

//     let categoryFilter = '';
//     let params = [queryString];

//     if (activeCategories.length > 0) {
//       categoryFilter = ` AND (${categoryConditions.join(' OR ')})`;
//       params = [...activeCategories, queryString];
//     }

//     const sql = `
//       SELECT * FROM menuitems
//       WHERE category LIKE ?${categoryFilter};
//     `;

//     db.transaction((tx) => {
//       tx.executeSql(sql, params, (_, { rows }) => {
//         const filteredItems = rows._array;
//         resolve(filteredItems);
//       });
//     });
//   });
// }


// export async function filterByQueryAndCategories(query, activeCategories) {
//   return new Promise((resolve, reject) => {
//     const categoryConditions = activeCategories.map(
//       (category) => `category = ?`
//     );

//     const queryString = `%${query}%`;

//     const sql = `
//       SELECT * FROM menuitems
//       WHERE name LIKE ? AND (${categoryConditions.join(' OR ')});
//     `;

//     const params = [queryString, ...activeCategories];

//     db.transaction((tx) => {
//       tx.executeSql(sql, params, (_, { rows }) => {
//         const filteredItems = rows._array;
//         resolve(filteredItems);
//       });
//     });
//   });
// };


// This code checks the structure of the database (FOR TESTING)
// export function getTableStructure() {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "PRAGMA table_info(menuitems);",
//         [],
//         (_, { rows }) => {
//           resolve(rows._array);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// }

// getTableStructure().then(structure => console.log(structure)).catch(error => console.error(error));

// This code checks what is in the database (FOR TESTING)
// export function fetchAllMenuItems() {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql('SELECT * FROM menuitems;', [], (_, { rows }) => {
//         resolve(rows._array);
//       }, (_, error) => {
//         reject(error);
//       });
//     });
//   });
// }

// fetchAllMenuItems().then(items => console.log('Items in the SQLite DB', items)).catch(error => console.error(error))

// This code drops the table to create a new on from scratch (FOR TESTING)
// export async function dropTable() {
//   return new Promise((resolve, reject) => {
//     db.transaction(
//       (tx) => {
//         tx.executeSql(
//           'DROP TABLE IF EXISTS menuitems;'
//         );
//       },
//       reject,
//       resolve
//     );
//   });
// }