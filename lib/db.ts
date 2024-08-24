import postgres from 'postgres';

const sql = postgres({
	ssl: true,
});

export default sql;
