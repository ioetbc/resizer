import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSrc: false,
			imageAltText: '',
			fontSize: '20',
			resultHtml: '',
			loading: false,
			finalWidth: 0,
			finalHeight: 0,
		};
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.getEmailTemplate = this.getEmailTemplate.bind(this);
	}

	onChangeHandler = event => {
		const file = event.target.files[0];
		const imageSrc = URL.createObjectURL(file);
		this.setState({ imageSrc, imageAltText: file.name.split(".")[0] }, () => {
			this.getEmailTemplate();
		});
	};

	getEmailTemplate = () => {
		const { fontSize } = this.state;
		this.setState({loading: true});
		const image = document.getElementById('placeholder-image');
		Tesseract.recognize(
			image,
			'eng',
		  ).then((data) => {
			this.setState({loading: false});
			const { imageSrc, imageAltText } = this.state;
			const text = data.data.text;
			const arrayOfLines = text.split("\n");
			const charsInLongestLine = arrayOfLines.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
			const rawWidth = image.clientWidth;
			const rawHeight = image.clientHeight;
			const finalWidth = Math.ceil(charsInLongestLine * parseInt(fontSize, 10));
			const finalHeight = Math.ceil(rawHeight / (rawWidth / finalWidth));


			const resultHtml = `<table width="460" align="center" border="0" cellpadding="0" cellspacing="0" class="width90pc">
				<tbody>
					<tr>
					<td
						style="text-align:left; color:#320b42; font-family:'Roboto', Arial, sans-serif; font-size:36px; font-weight:bold; padding-top: 50px">
						<img src=${imageSrc} alt=${imageAltText} width=${finalWidth}px height=${finalHeight}px border="0" style="display:inline-block; border:0px;" class="width100pc heightAuto">
					</td>
					</tr>
				</tbody>
			</table>`;

			this.setState({resultHtml, finalWidth,  finalHeight});

		})
	};

	copyToClipboard = async () => {
		await navigator.clipboard.writeText(this.state.resultHtml);
	};

  	render() {
		const { imageSrc, resultHtml } = this.state;
		return (
			<div className="resizer-wrapper">
				<h1>Email Header Resizer</h1>
				<div className="form-wrapper">
					<form>
						<select onChange={(e) => this.setState({ fontSize: e.target.value })}>
							<option value="20">h1</option>
							<option value="16">h2</option>
							<option value="12">h3</option>
						</select>
						<input type="file" name="file" onChange={this.onChangeHandler}/>


					</form>
				</div>
				<div className="result-wrapper">
					 <img id="placeholder-image" src={imageSrc} style={{display: !this.state.loading ? 'block' : 'none'}}  />
					<br/>
					{
						this.state.loading &&
							<div className="loader" />
					}
					{
						!this.state.loading && this.state.resultHtml &&
							<div className="result">
								<span id="resultSpan">{resultHtml}</span>
								<button className="copy-to-clipboard" onClick={() => this.copyToClipboard()}>Copy to Clipboard</button>
							</div>
					}

				</div>
			</div>
		);
  	}
}

export default App;