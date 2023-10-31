import React, { useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { debounce } from 'lodash';
import { ref, push, set, remove } from 'firebase/database';
import { db } from '../firebase';

export const TodoList = () => {
	const [fetchedTodos, setFetchedTodos] = useState({});
	const [sortAlphabetically, setSortAlphabetically] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [initialTodos, setInitialTodos] = useState([]);
	const [newTodoId, setNewTodoId] = useState(null);

	const requestAddTodo = (todo) => {
		if (!todo.text || /^\s*$/.test(todo.text)) {
			return;
		}

		const todosDbRef = ref(db, 'todos');
		const newTodoRef = push(todosDbRef);
		const newTodoId = newTodoRef.key;
		const newTodo = { title: todo.text };
		setNewTodoId(newTodoId);

		set(ref(db, `todos/${newTodoId}`), newTodo).then(() => {
			console.log('Задача добавлена', newTodo);
		});

		setInitialTodos([...initialTodos, newTodoId]);
	};

	const requestUpdateTodo = (todoId, newTitle) => {
		if (!newTitle.text || /^\s*$/.test(newTitle.text)) {
			return;
		}

		const updatedTodo = { title: newTitle.text };

		const todosDbRef = ref(db, `todos/${todoId}`);
		set(todosDbRef, updatedTodo).then(() => {
			console.log('Задача обновлена', updatedTodo);
		});

		setFetchedTodos((prevFetchedTodos) => ({
			...prevFetchedTodos,
			[todoId]: updatedTodo,
		}));
	};

	const requestRemoveTodo = (id) => {
		const todoRef = ref(db, `todos/${id}`);

		remove(todoRef)
			.then(() => {
				console.log('Задача удалена');
			})
			.catch((error) => {
				console.error('Ошибка при удалении задачи:', error);
			});
	};

	const debouncedSearch = debounce((searchTerm) => {
		handleSearch(searchTerm);
	}, 300);

	const handleSearch = (searchTerm) => {
		if (initialTodos.length === 0) {
			setInitialTodos({ ...fetchedTodos });
		}

		const filteredTodos = Object.fromEntries(
			Object.entries(fetchedTodos).filter(([id, todo]) => {
				if (searchTerm) {
					return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
				} else {
					return true;
				}
			}),
		);

		setFetchedTodos(filteredTodos);
	};

	const handleResetSearch = () => {
		setSearchTerm('');
		setFetchedTodos(initialTodos);
	};

	const handleSort = () => {
		if (sortAlphabetically) {
			const sortedTodos = Object.fromEntries(
				Object.entries(fetchedTodos).sort((a, b) =>
					a[1].title.localeCompare(b[1].title),
				),
			);
			setFetchedTodos(sortedTodos);
		} else {
			setSortAlphabetically(!sortAlphabetically);
		}
	};

	return (
		<>
			<h1>Какие планы на сегодня?</h1>
			<button onClick={handleSort}>
				{sortAlphabetically ? 'Сортировать по алфавиту' : 'Сбросить сортировку'}
			</button>
			<TodoForm
				onSubmit={requestAddTodo}
				fetchedTodos={fetchedTodos}
				setFetchedTodos={setFetchedTodos}
				newTodoId={newTodoId}
				onSearch={debouncedSearch}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				handleResetSearch={handleResetSearch}
			/>
			<Todo
				fetchedTodos={fetchedTodos}
				setFetchedTodos={setFetchedTodos}
				requestRemoveTodo={requestRemoveTodo}
				requestUpdateTodo={requestUpdateTodo}
			/>
		</>
	);
};
