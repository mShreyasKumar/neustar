import React from 'react';

export class StringCompetition extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nFirstWins: 0,
			winIndex: 68,
			winIndexString: '',
			fileData: '',
			isLoading: false
		};
	}

	componentDidMount() {
		this.setState({isLoading: true});
		this.loadTextFile();
	}

	loadTextFile = () => {
		let self = this;
		fetch('input.txt')
		.then(function(response) {
			return response.text();
		})
		.then(function(text) {
			self.processData(text);
			self.setState({isLoading: false});
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	processData = (data) => {
		let arrLines = data.split('\n');
		let nFirstWins = 0;
		let nthWinString = '';
		let regexatoz = new RegExp('^[a-zA-Z]+$');
		for (let i = 0; i < arrLines.length; i++) {
			let arrStr = arrLines[i].split(' ');
			let strA = arrStr[0];
			let strB = arrStr[1];
			if(strA && strB) {
				if(strA.toLowerCase().indexOf('no') >= 0 || 
					strB.toLowerCase().indexOf('no') >= 0 ||
					!regexatoz.test(strA.trim()) ||
					!regexatoz.test(strB.trim())) {
					continue;
				}

				let arrA = strA.split('').sort(function(a,b){return b.charCodeAt(0) - a.charCodeAt(0)});
				let arrB = strB.split('').sort(function(a,b){return b.charCodeAt(0) - a.charCodeAt(0)});
				let isFirstHigh = false;
				let equalCount = 0;
				for (var j = 0; j < arrA.length; j++) {
					if(arrA[j].charCodeAt(0) > arrB[j].charCodeAt(0)) {
						isFirstHigh = true;
						equalCount = 0;
						break;
					} else if(arrA[j].charCodeAt(0) < arrB[j].charCodeAt(0)) {
						equalCount = 0;
						break;
					} else {
						equalCount++;
					}
				}
				if(equalCount && arrB.length > arrA.length) {
					if(arrA[arrA.length - 1].charCodeAt(0) > arrB[arrA.length].charCodeAt(0)) {
						isFirstHigh = false;
					}
				}
				if(isFirstHigh) {
					nFirstWins++;
					if(nFirstWins === this.state.winIndex) {
						nthWinString = strA;
					}
				}
			}
		}
		this.setState({
			nFirstWins: nFirstWins,
			winIndexString: nthWinString
		});
	}

	render() {
		return (
			<div className={this.state.isLoading ? "loading": ""}>
				<h1>First String wins {this.state.nFirstWins} times</h1>
				{
					this.state.winIndexString &&
					<p>When the first string wins for the 
						<strong> {this.state.winIndex}</strong>th time, first string was 
					 	<strong> {this.state.winIndexString}</strong>
					</p>
				}
			</div>
		);
	}
}