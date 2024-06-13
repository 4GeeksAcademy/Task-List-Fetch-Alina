import React from "react";
import { useState, useEffect } from "react";

//create your first component
const Home = () => {	
	const [list, setList] = useState([])
	const [name, setName] = useState("Styoks")
	const [showModal, setShowModal] = useState(true);

	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	useEffect(()=> {
		getData()
	}, [name])

	async function createUser () {
		await fetch(`https://playground.4geeks.com/todo/users/${name}`,{
			method:"POST"
		})
		console.log("No existia")
		setList([])
	}

	async function getData () {
		try {
			const result = await fetch(`https://playground.4geeks.com/todo/users/${name}`)
			const data = await result.json()
			const reversedArray = data.todos.reverse()
			setList(reversedArray)
			console.log("Ya existe");
		} catch {
			createUser()
		}
	}

	async function enterTodo (event) {
		if (event.keyCode === 13 && event.target.value !== ""){ 
			const result = await fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
				method: "POST",
				body: JSON.stringify({
					"label": event.target.value,
					"is_done": false
				  }),
				headers: {
					"Content-Type": "application/json"
				}
			})

			if (result.ok) {
				const dataJson = await result.json()
				setList((prevArray)=> {
					return [dataJson, ...prevArray] //newest fist
				})
			}
			console.log()
			event.target.value = ""
		}
	}

	async function removeTask (index) {
		if (index <= -1) return // only splice array when item is found
		const result = await fetch(`https://playground.4geeks.com/todo/todos/${index}`, {
			method: "DELETE",
			})
			
		if (result.ok){
			setList((prevArray)=> {
				const filteredArray = prevArray.filter((item)=> item.id !== index)
				return filteredArray
			})
		}
	}

	function changeUser(event) {
		if (event.keyCode === 13 && event.target.value !== ""){
			setName(event.target.value)
			event.target.value = ""
			handleCloseModal()
		}
	} 

	async function clearUser () {
		await Promise.all(list.map(async(item)=>{
			await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
				method: "DELETE",
			})
		}))
		
		setList([])
	}

	const finalMessage = 
	(list.length > 0) ? `${list.length} items left` : "No tasks, add a task"
	
	return (
		<div className="container d-flex justify-content-center align-items-center flex-column p-5 rounded-5">
			<h1 className="display-1 mb-5">todos</h1>
			<div className="w-100">
				<input className="w-100 input-group-text" type="text" onKeyDown={enterTodo} />
				<ul className="list-group mt-5">
				{ list.map((item, index) => {
					return <li key={index} id={item.id} className="list-group-item justify-content-between d-flex liColor">{item.label}<button className="closeButton rounded-3" type="button" onClick={()=>removeTask(item.id)}><strong>x</strong></button></li>
				}) }
				<li className="list-group-item liColor">{finalMessage}</li>
				</ul>
			</div>
			<button className="btn btn-primary mt-2" onClick={clearUser}>Clear User</button>
			<button type="button" className="btn btn-primary" data-bs-toggle="modal" onClick={handleShowModal} data-bs-target="#exampleModal">
				Change user
			</button>
			<div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="exampleModalLabel">Put your user below</h1>
						<button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleCloseModal} aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<input type="text" onKeyDown={changeUser} className="w-100" placeholder="If the user does not exist it will create it for you"/>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" onClick={handleCloseModal} data-bs-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary" onClick={changeUser}>Change user!</button>
					</div>
					</div>
				</div>
			</div>
			
		</div>
		
	);
};

export default Home;
