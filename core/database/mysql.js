const mysql = require("mysql2/promise");
let config = {
    connectionLimit: 100,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    debug: false,
    multipleStatements: true
};
mysql.createConnection({host: process.env.SQL_HOST, user: process.env.SQL_USER, password: process.env.SQL_PASSWORD}).then(function (resCon) {
    resCon.query("CREATE DATABASE IF NOT EXISTS " + process.env.SQL_DATABASE, []).then(async function (result) {
        dbMigrate.sync('20191223172136-initial').then(async function (resMigrate) {
            global.sql = await mysql.createPool(config);
        });
    });
});

module.exports = {
    init: async function() {

    },
    getOneRow: async function (tableName, filters) {
        let query = 'SELECT * FROM ' + tableName;
        if(Object.keys(filters).length > 0)
            query = query +' WHERE ' + Object.entries(filters).map(x => x[0] + ' = ?').join(', ');
        let [result, ignored] = await sql.query(query, Object.values(filters));
        result = await this.attachForeignKey(result, foreignKeys[tableName]);
        return result[0];
    },
    getRows: async function (tableName, filters) {
        let query = 'SELECT * FROM ' + tableName;
        if (Object.values(filters).length > 0)
            query += ' WHERE ' + Object.entries(filters).map(x => x[0] + ' = ?').join(', ');
        let [result, ignored] = await sql.query(query, Object.values(filters));
        result = await this.attachForeignKey(result, foreignKeys[tableName]);
        return result;
    },
    attachForeignKey: async function (rows, foreignKeys) {
        try {
            for (let foreignKey in foreignKeys) {
                if (foreignKeys.hasOwnProperty(foreignKey)) {
                    for (let row of rows) {
                        if (!row[foreignKey] || row[foreignKey] === "")
                            continue;
                        row[foreignKey.slice(0, -3)] = await this.getOneRow(foreignKeys[foreignKey], {id: row[foreignKey]});
                    }
                }
            }
            return rows;
        } catch (error) {
            throw error;
        }
    },
    getRowsCustom: async function (table, filers, sort, from, pageSize, fullTextFields, fullTextValue) {
        let query = '';
        let whereClauses = [];
        let queryArguments = [];
        if (fullTextValue !== "" && fullTextValue !== null)
            whereClauses.push(fullTextFields.join('|') + " LIKE '%" + fullTextValue + "%'");
        for (const filter in filers) {
            if (filers.hasOwnProperty(filter) && filers[filter] && filers[filter] !== '') {
                whereClauses.push(filter + " = ?");
                queryArguments.push(filers[filter]);
            }
        }
        if (whereClauses.length > 0)
            query += " WHERE " + whereClauses.join(" AND ");
        let [count, ignored2] = await sql.query("SELECT COUNT(id) AS count FROM " + table + query, queryArguments);
        count = count[0].count;
        if (count === 0)
            return [];
        let [result, ignored] = await sql.query("SELECT * FROM " + table + query + " ORDER BY " + sort.property + " " + sort.direction + " LIMIT ? OFFSET ?", queryArguments.concat([parseInt(pageSize), parseInt(from)]));
        if (result.length > 0) {
            result[0].count = count;
            result = await this.attachForeignKey(result, foreignKeys[table]);
        }
        return result;
    },
    updateRow: async function (tableName, row, id) {
        try {
            for (let i = 0; i < Object.keys(row).length; i++) {
                if (Array.isArray(Object.values(row)[i])) {
                    row[Object.keys(row)[i]] = Object.values(row)[i].join(',');
                }
            }
            if (tableName === 'operator')
                row['status'] = 'updated';
            let query = 'UPDATE ' + tableName + ' SET ' + Object.entries(row).map(x => x[0] + ' = ?').join(', ') + " WHERE id = " + id;
            let [result, ignored] = await sql.query(query, Object.values(row));
            if (tableName === 'service')
                serviceTree = await this.service.getServicesTree();

            return result.affectedRows === 1;
        } catch (error) {
            throw error;
        }
    },

    insertRow: async function (tableName, row) {
        for (let i = 0; i < Object.keys(row).length; i++) {
            if (Array.isArray(Object.values(row)[i])) {
                row[Object.keys(row)[i]] = Object.values(row)[i].join(',');
            }
        }
        let query = 'INSERT INTO ' + tableName + '(' + Object.keys(row).join(',') + ') VALUES (' + ''.padStart((Object.values(row).length * 2) - 1, '?,') + ')';
        let [result, ignored] = await sql.query(query, Object.values(row));
        if (tableName === 'service')
            serviceTree = await this.service.getServicesTree();
        return result.insertId;
    },
    deleteRows: async function (tableName, Ids) {
        try {
            let [result, ignored] = await sql.query("DELETE FROM " + tableName + " WHERE id IN (?)", [Ids]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },
    deleteRowsCustom: async function (tableName, filter) {
        try {
            let [result, ignored] = await sql.query("DELETE FROM " + tableName + " WHERE " + Object.entries(filter).map(x => x[0] + ' = ?').join(', '), Object.values(filter));
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },
};