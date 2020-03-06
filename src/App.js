import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { imageSrc: false, imageAltText: '', fontSize: '20' };
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.getEmailTemplate = this.getEmailTemplate.bind(this);
	}

	onChangeHandler = event => {
		console.log(event.target.files[0])
		const file = event.target.files[0]
		const imageSrc = URL.createObjectURL(file);

		this.setState({ imageSrc, imageAltText: file.name.split(".")[0] });
	}

	getEmailTemplate() {
		const { fontSize } = this.state;
		const image = document.getElementById('placeholder-image');
		Tesseract.recognize(
			image,
			'eng',
		  ).then((data) => {
			console.log('image as text', data);
			const { imageSrc, imageAltText } = this.state;
			const text = data.data.text;
			const arrayOfLines = text.split("\n");
			const charsInLongestLine = arrayOfLines.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
			const rawWidth = image.clientWidth;
			const rawHeight = image.clientHeight;
			const finalWidth = Math.ceil(charsInLongestLine * parseInt(fontSize, 10));
			const finalHeight = Math.ceil(rawHeight / (rawWidth / finalWidth));


			console.log('fonalWidth', finalWidth);
			console.log('finalHeight', finalHeight);

			const html = `<table width="460" align="center" border="0" cellpadding="0" cellspacing="0" class="width90pc">
				<tbody>
					<tr>
					<td
						style="text-align:left; color:#320b42; font-family:'Roboto', Arial, sans-serif; font-size:36px; font-weight:bold; padding-top: 50px">
						<img src=${imageSrc} alt=${imageAltText} width=${finalWidth}px height=${finalHeight}px border="0" style="display:inline-block; border:0px;" class="width100pc heightAuto">
					</td>
					</tr>
				</tbody>
			</table>`

			console.log('html', html)

		})
	}

  	render() {
		const { imageSrc } = this.state;
		return (
			<div>
				<form>
					<select onChange={(e) => this.setState({ fontSize: e.target.value })}>
						<option value="20">h1</option>
						<option value="16">h2</option>
						<option value="12">h3</option>
					</select>
					<input type="file" name="file" onChange={this.onChangeHandler}/>
					{ imageSrc && <img id="placeholder-image" src={imageSrc} onLoad={this.getEmailTemplate} /> }
				</form>
			</div>
		);
  	}
}

export default App;