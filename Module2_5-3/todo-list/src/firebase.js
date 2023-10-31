import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBjNAYguiGz2o2AQ9711tEe-TNJ7AldlHQ',
	authDomain: 'todosproject-d24e0.firebaseapp.com',
	projectId: 'todosproject-d24e0',
	storageBucket: 'todosproject-d24e0.appspot.com',
	messagingSenderId: '783736217601',
	appId: '1:783736217601:web:331c27574ccef7f3fbe000',
	databaseURL:
		'https://todosproject-d24e0-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
