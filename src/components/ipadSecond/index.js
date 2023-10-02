// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_ipad from '../button/style_ipad';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class IpadSecondPage extends Component {

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = "";
		// this sets the location of the user
		this.setState({ locate: this.props.locate });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (location) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/units/city.json
		// used to get the coordinates and location of the user so that it can be used in a different API call
		$.ajax({
			url: `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=858c9f69a27455bb2f5362328022d6ff`,
			dataType: "jsonp",
			success: this.getLocCoords,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
	};

	// a call to fetch specific weather data via wunderground
	fetchWeather = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/lat/lon/units/city.json
		// used to get the daily weather like min/max weather, humidity, wind speed, etc
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=858c9f69a27455bb2f5362328022d6ff`,
			dataType: "jsonp",
			success: this.parseResponse,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
	};

	// a call to fetch weather data via wunderground
	// used to get the 3 hourly data from the api then calls the getHourlyWeather method on success
	fetchHourly = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/units/city.json
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/forecast?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&appid=858c9f69a27455bb2f5362328022d6ff`,
			//url: `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=858c9f69a27455bb2f5362328022d6ff`,
			dataType: "jsonp",
			success: this.getHourlyWeather,
			error: function (req, err) {
				console.log("API call failed " + err);
			},
		});
	};


	// the main render method for the extended iphone page component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.degrees}` : style.temperature;

		// display detailed weather data
		return (
			<div class={style.container}>
				<div>
					<div class={style.city}>{this.props.locate}</div>
					<div style="margin-bottom: 50%">
						<table>
                          <tr>
                            <th class={style.degSign}>{this.state.firstTemp}</th>
                            <th class={style.degSign}>{this.state.secondTemp}</th>
                            <th class={style.degSign}>{this.state.thirdTemp}</th>
                            <th class={style.degSign}>{this.state.fourthTemp}</th>
                            <th class={style.degSign}>{this.state.fifthTemp}</th>
                          </tr>
                          <tr>
                          	<td><img src={this.state.firstPic} width={50} height={50}></img></td>
                          	<td><img src={this.state.secondPic} width={50} height={50}></img></td>
                          	<td><img src={this.state.thirdPic} width={50} height={50}></img></td>
                          	<td><img src={this.state.fourthPic} width={50} height={50}></img></td>
                          	<td><img src={this.state.fifthPic} width={50} height={50}></img></td>

                          </tr>
                          <tr>
                            <td>{this.state.firstCond}</td>
                            <td>{this.state.secondCond}</td>
                            <td>{this.state.thirdCond}</td>
                            <td>{this.state.fourthCond}</td>
                            <td>{this.state.fifthCond}</td>

                          </tr>
                          <tr>
                            <td>{this.state.firstTime}:00</td>
                            <td>{this.state.secondTime}:00</td>
                            <td>{this.state.thirdTime}:00</td>
                            <td>{this.state.fourthTime}:00</td>
                            <td>{this.state.fifthTime}:00</td>
                          </tr>
                        </table>

						<div class={style.additionalInfo}>
							<p class={style.degSign}>Minimum Temperature: {this.state.temp_min}</p>
							<p class={style.degSign}>Maximum Temperature: {this.state.temp_max}</p>
							<p>Pressure: {this.state.press}hPa</p>
							<p>Humidity: {this.state.humid}%</p>
							<p>Cloud Coverage: {this.state.c_coverage}%</p>
							<p>Wind Speed: {this.state.w_speed}m/s</p>
							<p class={style.timeName} onClick={this.props.changeScreen}>Click here to see less</p>
						</div>
					</div>
				</div>
			</div>
		);
	}


	// gets the 3 hourly time, weather condition and temperature
	getHourlyWeather = (parsed_json) => {
		let hourlyData = parsed_json["list"];

		this.setState({
			firstTime: new Date(hourlyData[0]["dt"] * 1000).getHours(),
			firstCond: hourlyData[0]["weather"][0]["main"],
			firstTemp: Math.round(hourlyData[0]["main"]["temp"]),

			secondTime: new Date(hourlyData[1]["dt"] * 1000).getHours(),
            secondCond: hourlyData[1]["weather"][0]["main"],
            secondTemp: Math.round(hourlyData[1]["main"]["temp"]),

            thirdTime: new Date(hourlyData[2]["dt"] * 1000).getHours(),
			thirdCond: hourlyData[2]["weather"][0]["main"],
			thirdTemp: Math.round(hourlyData[2]["main"]["temp"]),

            fourthTime: new Date(hourlyData[3]["dt"] * 1000).getHours(),
			fourthCond: hourlyData[3]["weather"][0]["main"],
			fourthTemp: Math.round(hourlyData[3]["main"]["temp"]),

            fifthTime: new Date(hourlyData[4]["dt"] * 1000).getHours(),
			fifthCond: hourlyData[4]["weather"][0]["main"],
			fifthTemp: Math.round(hourlyData[4]["main"]["temp"]),
		});


		const arr = [this.state.firstCond, this.state.secondCond, this.state.thirdCond, this.state.fourthCond, this.state.fifthCond]
		const time = [this.state.firstTime, this.state.secondTime, this.state.thirdTime, this.state.fourthTime, this.state.fifthTime]


		for (let i = 0; i < arr.length; i++) {
			var DoN = "";

			if (6 < time[i] && time[i] < 18) { DoN = "d"; }
			else { DoN = "n"; }

			var link = "";
			if (arr[i] == "thunderstorm") {
				link = "http://openweathermap.org/img/wn/11"+ DoN + "@2x.png";
			} else if (arr[i] == "Drizzle") {
				link = "http://openweathermap.org/img/wn/09" + DoN + "@2x.png";
			} else if (arr[i] == "Rain") {
				link = "http://openweathermap.org/img/wn/10" + DoN + "@2x.png";
			} else if (arr[i] == "Snow") {
				link = "http://openweathermap.org/img/wn/13" + DoN + "@2x.png";
			} else if (arr[i] == "Mist" || arr[i] == "Smoke" || arr[i] == "Haze" || arr[i] == "Dust" || arr[i] == "Fog" || arr[i] == "Sand" || arr[i] == "Ash") {
				link = "http://openweathermap.org/img/wn/50" + DoN + "@2x.png";
			} else if (arr[i] == "Clear") {
				link = "http://openweathermap.org/img/wn/01" + DoN + "@2x.png";
			} else {
				link = "http://openweathermap.org/img/wn/02" + DoN + "@2x.png";
			}

			if (i==0){
				this.setState({firstPic: link});
			} else if (i==1) {
				this.setState({secondPic: link});
			} else if (i==2) {
				this.setState({thirdPic: link});
			} else if (i==3) {
				this.setState({fourthPic: link});
			} else if (i==4) {
				this.setState({fifthPic: link});
			}
		}
	};


	// used to get the coordinates and the location of the user
	getLocCoords = (parsed_json) => {
		this.setState({
			locate: parsed_json["name"],
			lon: parsed_json["coord"]["lon"],
			lat: parsed_json["coord"]["lat"],
		});

		this.fetchWeather();
	};

	// used to get the daily data from the location/coordinates of the user
	parseResponse = (parsed_json) => {
		let daily = parsed_json["daily"];

		var i = this.props.day;

		this.setState({
			temp: daily[i]["temp"]["day"],
			temp_min: daily[i]["temp"]["min"],
			temp_max: daily[i]["temp"]["max"],
			press: daily[i]["pressure"],
			humid: daily[i]["humidity"],
			c_coverage: daily[i]["humidity"],
			w_speed: daily[i]["wind_speed"],
		});

		this.fetchHourly();
	};



	// Retrieve weather data after page load
	componentDidMount() {
		this.fetchWeatherData(this.state.locate);
	}

}
