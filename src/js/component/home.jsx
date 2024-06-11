import React from "react";
import { useState, useEffect } from "react";

//create your first component
const Home = () => {	
	const [list, setList] = useState([])

	useEffect(async()=>{
		const result = await fetch(`https://playground.4geeks.com/todo/users/Styoks`)
		const data = await result.json()
		setList(data.todos)
		console.log(data.todos)
		

	}, [])
	
	function enterPressed (event) {
		if (event.keyCode === 13 && event.target.value !== ""){
			const newValue = event.target.value //needed because setList go slow lmao
			
			setList((prevArray)=> {
				return [newValue, ...prevArray] //newest fist
			})
			
			event.target.value = ""
		}
	}

	function removeTask (index) {
		if (index <= -1) return // only splice array when item is found

		setList((prevArray)=> {
			prevArray.splice(index, 1)
			return [...prevArray]
		})
	}
	
	const finalMessage = 
	(list.length > 0) ? `${list.length} items left` : "No tasks, add a task"
	
	return (
		<div className="container d-flex justify-content-center align-items-center flex-column p-5 rounded-5">
			<h1 className="display-1 mb-5">todos</h1>
			<div className="w-100">
				<input className="w-100 input-group-text" type="text" onKeyDown={enterPressed} />
				<ul className="list-group mt-5">
				{ list.map((item, index) => {
					return <li key={index} id={index} className="list-group-item justify-content-between d-flex liColor">{item.label}<button className="closeButton rounded-3" type="button" onClick={()=>removeTask(index)}><strong>x</strong></button></li>
				}) }
				<li className="list-group-item liColor">{finalMessage}</li>
				</ul>
			</div>
		</div>
	);
};

export default Home;
