const knex = require('knex');

const PGHOST = 'ep-holy-sky-a5bukd7l.us-east-2.aws.neon.tech';
const PGDATABASE = 'neondb';
const PGUSER = 'neondb_owner';
const PGPASSWORD = 'EVNIZ5TrY3up';
const PGPORT = 5432;


const db = knex({
    client: 'pg',
    connection: {
        host: PGHOST,
        port: PGPORT,
        user: PGUSER,
        database: PGDATABASE,
        password: PGPASSWORD,
        ssl: { rejectUnauthorized: false }
    }
});


async function getVersion(){
    try{
        const res = await db.raw('select version()');
        console.log(res);
    }catch(error){
        console.log(error);
    }
}

getVersion();

module.exports = db;