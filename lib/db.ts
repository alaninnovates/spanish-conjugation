import postgres from 'postgres';

const sql = postgres({
	ssl: true,
	debug: (conn, query, params) => {
		console.log('QUERY:', query);
		console.log('PARAMS:', params);
	},
});

export default sql;
