import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const TodoForm = (props) => {
	const [todoText, setTodoText] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();

		const todosDbRef = ref(db, 'todos');

		return onValue(todosDbRef, (snapshot) => {
			if (typeof props.setFetchedTodos === 'function') {
				console.log('setFetchedTodos - это функция');
			} else {
				console.log('setFetchedTodos не является функцией');
			}

			const loadedTodos = snapshot.val();
			props.setFetchedTodos(loadedTodos);

			console.log('loadedTodos из ТудуФорм', loadedTodos);
			console.log(
				'props.setFetchedTodos(loadedTodos)',
				props.setFetchedTodos(loadedTodos),
			);
		});
	}, []);

	const handleChange = (e) => {
		setTodoText(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log('TodoForm - id', props.edit ? props.edit.id : props.newTodoId);
		console.log('TodoForm - text', todoText);

		props.onSubmit({
			id: props.edit ? props.edit.id : props.newTodoId,
			text: todoText,
		});

		setTodoText('');
	};

	return (
		<div className="todo-form">
			<form onSubmit={handleSubmit}>
				{props.edit ? (
					<>
						<input
							placeholder="Измените задачу"
							value={todoText}
							onChange={handleChange}
							name="text"
							ref={inputRef}
							className="todo-input edit"
						/>
						<button onClick={handleSubmit} className="todo-button edit">
							Обновить
						</button>
					</>
				) : (
					<>
						<input
							placeholder="Добавьте задачу"
							value={todoText}
							onChange={handleChange}
							name="text"
							className="todo-input"
							ref={inputRef}
						/>
						<button onClick={handleSubmit} className="todo-button">
							Добавить
						</button>
					</>
				)}
			</form>
			<input
				type="text"
				placeholder="Поиск"
				value={props.searchTerm}
				onChange={(e) => props.setSearchTerm(e.target.value)}
			/>
			<button onClick={() => props.onSearch(props.searchTerm)}>Искать</button>
			<button
				onClick={() => {
					props.setSearchTerm('');
					props.handleResetSearch();
				}}
			>
				Сбросить
			</button>
		</div>
	);
};

export default TodoForm;
