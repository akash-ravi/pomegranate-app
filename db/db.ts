import * as SQLite from "expo-sqlite";

export const connectToDatabase = () => {
    return SQLite.openDatabase("pomegranate.db");
};

export const createTables = (db: SQLite.SQLiteDatabase) => {
    const historyQuery = `
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagePath TEXT,
            type TEXT,
            location TEXT,
            time INTEGER
        )
    `;
    return new Promise<void>((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(
                    historyQuery,
                    [],
                    () => resolve(),
                    (_, error) => {
                        console.error(error);
                        reject(new Error("Could not create tables"));
                        return false;
                    }
                );
            }
        );
    });
};

export const addHistoryItem = (db: SQLite.SQLiteDatabase, image: ImageType) => {
    const insertQuery = `
        INSERT INTO history (imagePath, type, location, time)
        VALUES (?, ?, ?, ?)
    `;
    const values = [image.imagePath, image.type, image.location, image.time];

    return new Promise<void>((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(
                    insertQuery,
                    values,
                    () => resolve(),
                    (_, error) => {
                        console.error(error);
                        reject(new Error("Failed to add contact"));
                        return false;
                    }
                );
            }
        );
    });
};

export const getHistoryRecords = (db: SQLite.SQLiteDatabase): Promise<ImageType[]> => {
    const selectQuery = "SELECT * FROM history";

    return new Promise<ImageType[]>((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(
                    selectQuery,
                    [],
                    (_, { rows }) => {
                        const historyRecords: ImageType[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            historyRecords.push(rows.item(i));
                        }
                        resolve(historyRecords);
                    },
                    (_, error) => {
                        console.error(error);
                        reject(new Error("Failed to get history records"));
                        return false;
                    }
                );
            }
        );
    });
};

export const deleteHistoryRecord = (db: SQLite.SQLiteDatabase, id: string) => {
    const deleteQuery = "DELETE FROM history WHERE id = ?";
    
    return new Promise<void>((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(
                    deleteQuery,
                    [+id],
                    () => resolve(),
                    (_, error) => {
                        console.error(error);
                        reject(new Error("Failed to delete history record"));
                        return false;
                    }
                );
            }
        );
    });
};
