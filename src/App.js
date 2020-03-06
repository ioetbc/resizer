import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { imageSrc: false };
		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler = event => {
		console.log(event.target.files[0])
		const imageSrc = URL.createObjectURL(event.target.files[0]);

		this.setState({ imageSrc });
	}

	getEmailTemplate() {
		const image = document.getElementById('placeholder-image');

		Tesseract.recognize(
			image,
			'eng',
		  ).then((data) => {
			console.log('image as text', data);
			const text = data.data.text;

			const arrayOfLines = text.split("\n");
			const charsInLongestLine = arrayOfLines.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
			const fontSize = 15;
			const rawWidth = image.clientWidth;
			const rawHeight = image.clientHeight;
			const finalWidth = charsInLongestLine * fontSize;
			const finalHeight = rawHeight / (rawWidth / finalWidth);



			console.log('fonalWidth', finalWidth);
			console.log('finalHeight', finalHeight);

		})
	}

  	render() {
		const { imageSrc } = this.state;
		return (
			<div>
				<form>
					<input type="file" name="file" onChange={this.onChangeHandler}/>
					{ imageSrc && <img id="placeholder-image" src={imageSrc} onLoad={this.getEmailTemplate} /> }
				</form>
			</div>
		);
  	}
}

export default App;
