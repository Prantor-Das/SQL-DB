import dotenv from 'dotenv';
// Importing the Client class from the 'pg' module to interact with PostgreSQL.
import { Client } from "pg";

dotenv.config();

// Creating a new instance of the Client with a connection string for the PostgreSQL database.
const pgClient = new Client(process.env.DB_URL as string);

// Async function to fetch user data from the database given an email
async function getUser(email: string) {
  try {
    await pgClient.connect(); // Ensure client connection is established

    // const insertquery = 'INSERT INTO users (username, email, password) VALUES (`${username}`, `${email}`, `${password}`);'; 
    // This is vulnerable to SQL injection, hence using parameterized queries below

    const query = 'SELECT * FROM users WHERE email = $1'; // Parameterized query to prevent SQL injection
    const values = [email];
    // Executing the query with the provided email parameter
    const result = await pgClient.query(query, values);

    // Parameterized queries help prevent SQL injection attacks by separating SQL code from data.
    // This ensures that user input is treated as data only, not executable code.

    console.log('Query Result:', result);

    if (result.rows.length > 0) {
      console.log('User found:', result.rows[0]); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log('No user found with the given email.');
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error('Error during fetching user:', err);
    throw err; // Rethrow or handle error appropriately
  } finally {
    await pgClient.end(); // Close the client connection
  }
}

// Example usage
getUser('prantordas@gmail.com').catch(console.error);

/*
Explanation:
1. The `pg` library is used to interact with a PostgreSQL database.
2. A reusable `pgClient` instance is created using a connection string.
3. The `getUser` function takes an email, connects to the database, and queries for the user.
4. Parameterized queries are used for security against SQL injection.
5. If the user is found, their details are logged and returned; otherwise, `null` is returned.
6. Errors are logged and rethrown for further handling.
7. The client connection is always closed after the query execution, ensuring proper resource cleanup.
8. An example call demonstrates how to use the `getUser` function and handle its output or errors.
*/