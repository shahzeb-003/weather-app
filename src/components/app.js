// import preact
import { h, Component } from "preact";

// import required Components from 'components/'
import IphoneSecondPage from "./IphoneSecond";
import Iphone from "./iphone";
import IpadSecondPage from "./ipadSecond";
import Ipad from "./ipad";
import $ from "jquery";

export default class App extends Component {


	constructor(props) {
		super(props);
		this.state = {
		  isTablet: false
		};
	  }
	
	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	  }
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	  }
	
	handleResize = () => {
		const isTablet = window.innerWidth >= 768;
		this.setState({ isTablet });
	  }
	
	//Assign states to fields which will be utilized later on
	state = {
		// this is used to change the visibility of the additional page so we can switch between iphone and iphonesecond
		secondPageVisible: false,
		// used to see the location of the user e.g. london
		locate: "",
		// used to change which day it is
		day: 0,
	};

	// once the components are loaded, checks if the url bar has a path with "ipad" in it, if so sets state of tablet to be true

	// set the state which will be used later on, in which page should be rendered
	flipScreen = () => {
		this.setState({
			secondPageVisible: !this.state.secondPageVisible,
		});
	};

	iconRec = (number) => {

	}

	// set the state for the difference in days from current day
	UpdateDay = (day) => {
		let change;
		if (typeof day === "string") {
			change = 0;
		} else {
			change = this.state.day + day;
		}
		this.setState({
			day: change,
		});
	};

	/*
		A render method to display the required Component on screen (iPhone or iPad) : selected by checking component's isTablet state
	*/
	render() {
		
		if (this.state.isTablet) {
			return (
				<div id="app">
					{}
					{this.state.secondPageVisible ? (
						<IpadSecondPage
							locate={this.state.locate}
							changeScreen={this.flipScreen}
							day={this.state.day}
						/>
					) : (
						<Ipad 
							locate={this.state.locate}
							changeScreen={this.flipScreen}
							updateLocation={(location) => {
								this.setState({
									locate: location,
								});
							}}
							DTUpdate={this.UpdateDay}
						/>
					)}
				</div>
			);
		} else {
			return (
				<div id="app">
					{
						// conditional operator which determines which page should be loaded
						// state components passed on to external pages to be used later on
					}
					{this.state.secondPageVisible ? (
						<IphoneSecondPage
							locate={this.state.locate}
							changeScreen={this.flipScreen}
							day={this.state.day}
						/>
					) : (
						<Iphone
							locate={this.state.locate}
							changeScreen={this.flipScreen}
							updateLocation={(location) => {
								this.setState({
									locate: location,
								});
							}}
							DTUpdate={this.UpdateDay}
						/>
					)}
				</div>
			);
		}
	}
}
