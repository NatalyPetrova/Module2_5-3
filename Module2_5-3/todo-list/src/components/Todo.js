import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({
	fetchedTodos,
	setFetchedTodos,
	requestRemoveTodo,
	requestUpdateTodo,
}) => {
	const [edit, setEdit] = useState('');
	console.log('edit:', edit);

	console.log('fetchedTodos из Туду', fetchedTodos);

	const submitUpdate = (id, text) => {
		requestUpdateTodo(id, text);
		console.log('id из submitUpdate', id);
		console.log('newTitle из submitUpdate', text);
		setEdit('');
	};

	if (edit.id) {
		return (
			<TodoForm
				edit={edit}
				onSubmit={submitUpdate}
				setFetchedTodos={setFetchedTodos}
			/>
		);
	}

	return Object.entries(fetchedTodos).map(([id, { title }]) => (
		<div className={'todo-row'} key={id}>
			<div key={id}>{title}</div>
			<div className="icons">
				<RiCloseCircleLine
					onClick={() => requestRemoveTodo(id)}
					className="delete-icon"
				/>
				<TiEdit
					onClick={() => setEdit({ id: id, value: title })}
					className="edit-icon"
				/>
			</div>
		</div>
	));
};

export default Todo;
