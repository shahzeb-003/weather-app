// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_ipad from '../button/style_ipad';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Ipad extends Component {

	
	constructor(props) {
		super(props);
		// initialises the hourChange to 0 so we can see what hour of weather we need to look at
		this.state.hourChange = 0;
		// initialises the weatherCond to nothing so we can show an error when we dont get anything from the api
		this.state.weatherCond = "";
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (location) => {
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=858c9f69a27455bb2f5362328022d6ff`;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: this.parseResponse,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
		this.setState({ display: true });
		// once the data grabbed, hide the button
		// changed so that the user can search again once on the next page when other stuff is loaded
		// the parts for the next page are loaded as well now that its true
	};

	//get weather data by given date&time
	find = (data) => {
		var hourly = data["hourly"];
		var datelong = String(this.state.year) + "-" + String(this.state.month + 1) + "-" + String(this.state.day) + " " + String(this.state.time) + ":00:00";

		var d = new Date(datelong);

		var num = d / 1000;
		var count = Object.keys(hourly).length;

		// go through api output and fetch required data
		for (let i = 0; i < count; i++) {
			if (hourly[i]["dt"] == num) {
				this.setState({
					temp: hourly[i]["temp"].toFixed(),
					cond: hourly[i]["weather"][0]["description"],
					id: hourly[i]["weather"][0]["id"],
					weatherCond: hourly[i]["weather"][0]["main"],
				});

				this.iconrec();
			}
		}
	};

	// used to collect the link from openweathermap for the different weather icons
	iconrec = () => {
		var DoN = "";

		if (6 < this.state.time && this.state.time < 18) { DoN = "d"; }
		else { DoN = "n"; }

		if (this.state.weatherCond == "thunderstorm") {
			this.setState({ link: "http://openweathermap.org/img/wn/11d@2x.png" });

		} else if (this.state.weatherCond == "Drizzle" || 520 <= this.state.id && this.state.id <= 531) {
			this.setState({ link: "http://openweathermap.org/img/wn/09d@2x.png" });

		} else if (701 <= this.state.id && this.state.id <= 781) {
			this.setState({ link: "http://openweathermap.org/img/wn/50d@2x.png" });

		} else if (500 <= this.state.id && this.state.id <= 504) {
			this.setState({ link: "http://openweathermap.org/img/wn/10" + DoN + "@2x.png"})

		} else if (
			this.state.weatherCond == "Snow" || this.state.cond == "freezing rain"
		) {
			this.setState({ link: "http://openweathermap.org/img/wn/13d@2x.png" });

		} else if (this.state.id == 800) {
			this.setState({ link: "http://openweathermap.org/img/wn/01" + DoN + "@2x.png"})

		} else if (this.state.id == 801) {
			this.setState({ link: "http://openweathermap.org/img/wn/02" + DoN + "@2x.png"})

		} else if (this.state.id == 802) {
			this.setState({ link: "http://openweathermap.org/img/wn/03" + DoN + "@2x.png"})

		} else if (this.state.id == 803 || this.state.id == 804) {
			this.setState({ link: "http://openweathermap.org/img/wn/04" + DoN + "@2x.png"})
		}
	};

	// a call to fetch the location longitude and latitude via wunderground
	coordsplit = (result) => {

		this.setState({ latitude: result[0]["lat"] });
		this.setState({ longitude: result[0]["lon"] });

		fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&units=metric&appid=858c9f69a27455bb2f5362328022d6ff`
		)
			.then((res) => res.json())
			.then((data) => this.find(data));
	};

	// a call to fetch weather data by given date&time
	forecast = () => {
		fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${this.props.locate}&limit=5&appid=858c9f69a27455bb2f5362328022d6ff`
		)
			.then((res) => res.json())
			.then((result) => this.coordsplit(result));
	};

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.degrees}` : style.temperature;
		const getinput = (event) => {
			const loc = event.target.value;
			this.fetchWeatherData(loc);
		};

		// Increase the time by 1 hour and fetch weather data
		const increaseHour = () => {
			if (this.state.hourChange < 48) {
				if (this.state.time == 23) {
					this.setState({ day: this.state.day + 1 });
					this.setState({ time: 0 });
					this.setState({ hourChange: this.state.hourChange + 1 });
				} else {
					this.setState({ time: this.state.time + 1 });
					this.setState({ hourChange: this.state.hourChange + 1 });
				}
				this.forecast();
			}
		};

		// Decrease the time by 1 hour and fetch weather data
		const decreaseHour = () => {
			if (this.state.hourChange == 1) {
				this.setState({ time: this.state.time - 1 });
				this.setState({ hourChange: this.state.hourChange - 1 });
				this.fetchWeatherData(this.props.locate);
			} else if (this.state.hourChange > 0) {
				if (this.state.time == 0) {
					this.setState({ day: this.state.day - 1 });
					this.setState({ time: 23 });
					this.setState({ hourChange: this.state.hourChange - 1 });
				} else {
					this.setState({ time: this.state.time - 1 });
					this.setState({ hourChange: this.state.hourChange - 1 });
				}
				this.forecast();
			}
		};

		// display all weather data
		return (
			<div class={style.container}>
				<div class={style.header}>

					<span class={tempStyles}>
						{this.state.temp}
					</span>

				</div>

				<div>
					{this.state.display ? (
						<img
							type="button"
							onClick={decreaseHour}
							src="../../assets/arrows/left.png"
							class={style.bacwardDate}
							width={30}
							height={63}
						></img>
					) : null}

					{this.state.display ? (
						<img
							class={style.weatherImage}
							src={this.state.link}
							width={225}
							height={225}
						></img>
					) : null}

					{this.state.display ? (
						<img
							type="button"
							onClick={increaseHour}
							src="../../assets/arrows/right.png"
							class={style.forwardDate}
							width={30}
							height={63}
						></img>
					) : null}
				</div>

				{this.state.display ? (
					<p class={style.timeName2}>{this.state.time} : 00<br></br>{this.state.day}/{this.state.month + 1}/{this.state.year}</p>
				) : null}
				

				<div
					class={style.conditions}
					//style={{ fontSize: this.state.condlarger }} //This part says the condition e.g. cloudy
				>
					{this.state.cond}
				</div>

				<div class={style.searchBox}>
					<input
						id="loc_input"
						type="text"
						class="search"
						placeholder="Location"
						onChange={getinput}
						style="text-transform: uppercase"
					/>
				</div>

				<div class={style.seeMoreButton}>
					{this.state.display ? (
						<p
						type ="button"
						onClick={this.props.changeScreen}
						class={style.timeName}>Click here to see more</p>
					) : null}
				</div>
			</div>
		);
	}

	//retrieves weather data from api call
	parseResponse = (parsed_json) => {
		var location = parsed_json["name"];
		var temp_c = parsed_json["main"]["temp"];
		var conditions = parsed_json["weather"]["0"]["description"];
		var idCond = parsed_json["weather"]["0"]["id"];
		var main_weath = parsed_json["weather"]["0"]["main"];
		var timezone = parsed_json["timezone"];

		this.props.updateLocation(location);
		var unix = Math.round(+new Date() / 1000);
		var date = new Date((unix + timezone) * 1000);

		// set states for fields so they could be rendered later on
		this.setState({
			temp: temp_c.toFixed(),
			cond: conditions,
			id: idCond,
			weatherCond: main_weath,
			time: new Date(date).getHours(),
			day: new Date(date).getDate(),
			month: new Date(date).getMonth(),
			year: new Date(date).getFullYear(),
			hourChange: 0,
		});

		this.props.DTUpdate("reset");
		this.iconrec();
	};

	// Fetch weather data after loading up the page
	componentDidMount() {
		if (this.props.locate) {
			this.fetchWeatherData(this.props.locate);
		}
	}
}
