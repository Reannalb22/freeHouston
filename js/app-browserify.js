// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	ReactCSSTransitionReplace = require('react-css-transition-replace'),
	Parse = require('parse')
	// ReactCSSTransitionGroup = require('react-addons-css-transition-group');

window.Parse = Parse
window.React = React
window.$=$
var APP_ID = 'e7jWEAOxt9YSki1VgZJU5OMGsWWDphm7ZRMbgTYS',
	JS_KEY = 'GA1OcaDeYAVWaGVVPnCVwbEnn4Muej6YKMi3p1Mh',
	REST_API_KEY = 'tNF3vLrlnjgozpu8tMC6aKLleLxww8R5fqpwfpcP'

Parse.initialize(APP_ID,JS_KEY)

// var createDate=(datStr,timeStr){
// var newDate = new Date()
// dateArray=datStr.split('-')
// 		newDate.setFullYear(dateArray[0])
// 		newDate.setMonth(dateArray[1]-1)
// 		newDate.setDate(dateArray[2])
// return newDate
// },

// myDate = createDate($('.input[type=date]').val())


var freeCollection = Backbone.Collection.extend({
	url:'https://www.eventbriteapi.com/v3/events/search/?venue.city=Houston&price=free',
	token:'CSHMIFYCN4CU3GOWHR5C',
	parse: function(responseData){
		// console.log(responseData)
		return responseData.events
	}
})

var freeModel = Backbone.Model.extend({
	url : function(){
		return `https://www.eventbriteapi.com/v3/events/${this.get('id')}/`
	},

	token: 'CSHMIFYCN4CU3GOWHR5C'

	// parse: function(responseData){
	// 	// console.log(responseData)
	// 	return responseData.events
	// }
})

// key: 'XSX52YKC2DDMNF4D4Q'

// client_secret: '4UVXHV53T7S36JQABUWC2IEDMVKWCFDQQQEDMLU4475QHPPZTF'

// OAuth_token: 'RFJVFZFYRORRQSOUJG2L' 

// Anon_access_token: 'CSHMIFYCN4CU3GOWHR5C'


var HomeView = React.createClass({

	getInitialState: function(){
		return {
			formState: null
		}
		// formState has three possible values: null, "signUp", and "logIn"
	},

	_popupDecide:function(){
		if(!this.props.showLogin)return <div />
		return <SignPop formState={this.state.formState} />
	},
	render: function(){

		console.log(this.props.events)
		return (
			<div id="homeView">
				<NavBar />
				<div id="titleBar">
					<TitleBar />
				</div>
				<div id="eventContent">
					<SearchBar />
					<ListEvents events = {this.props.events} />
				</div>
					{this._popupDecide()}


			
				{/*<ReactCSSTransitionReplace transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{this._popupDecide()}
				</ReactCSSTransitionReplace>*/}
			</div>
		)
	}
})


var TitleBar = React.createClass({
	render: function(){
		return(
			<h1> Free Houston Events </h1>
		)
	}
})

var NavBar = React.createClass({
	render: function(){
		return(
			<div id="navButtons">
				<div>
					<input type = "checkbox" id = "dropButton"></input>
					<ul id="dropdown-menu">
				      <li><a href="#about">About</a></li>
				      <li><a href="#createEvent">Create Event</a></li>
				      <li><a href="#sign">Sign Up</a></li>
				      <li><a href="#logout">Log Out</a></li>
				    </ul>
				</div>
			</div>
		)
	}
})

var SearchBar = React.createClass({
	_searchHandler: function(event){
		{
			var inputEl = event.target,
				dates = inputEl.value
			location.hash = `search/${dates}`
		}
	},

	render: function(){
		return(
			<input type="date" placeholder="Search Events i.e. tomorrow, this_weekend" onChange = {this._searchHandler} />
		)
	}
})


var Event= React.createClass({
	
	_clickEvent: function(event){
		var detailClick = event.target,
			detailId = detailClick.id;
		location.hash = `details/${detailId}`
	},

	render: function(){
		return (
			<div>
				<p onClick = {this._clickEvent} id={this.props.data.attributes.id}>{this.props.data.get("name").text}</p>
			</div>
		)
	}
})

var ListEvents = React.createClass({
	
	_renderEvent: function(eventObj){
		// console.log(eventObj)
		return <Event key={eventObj.id} data={eventObj} />
	},

	render: function(){
		var events = this.props.events, 
			componentArray = events.map(this._renderEvent)
// console.log(events)
		return <div>{componentArray}</div>
	}
})

var DetailsView = React.createClass({
	render: function(){
		return(
			<div id="detailView">
				<EventNavBar />
				<Details event = {this.props.event} />
			</div>
		)
	}
})

var Details = React.createClass({
	render: function(){
		var name = this.props.event.attributes.name.text
		
		var url = this.props.event.attributes.url

		var start = new Date(this.props.event.attributes.start.local)
		var sDate = start.toLocaleDateString()
		
		var sTime = start.toLocaleTimeString().replace(':00', '')
		
		var end = new Date(this.props.event.attributes.end.local)
		var eDate = end.toLocaleDateString()
		
		var eTime = end.toLocaleTimeString().replace(':00', '')
		
		var logo
		if(this.props.event.attributes.logo) {
			logo = this.props.event.attributes.logo.url
		}
		else logo = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Panoramic_Houston_skyline.jpg'
		
		return(
			<div id="details">
				<h3>{name}</h3>
				<img src = {logo} />
				<p id="date"><strong>{sDate} {sTime} to {eDate} {eTime}</strong></p>
				<p id="url"> <strong>Find Out More at:</strong> <a href = {url}> {url} </a></p>
			</div>
		)
	}
})


var AboutView = React.createClass({
	render: function(){
		return (
			<div id="aboutview">
				<AboutNav />
				<h3>About</h3>
				<p id="firstpara">	Free Houston Events is where Houstonians go to find what's happening in Houston, for free. 
				</p>
				<p>	If you're a company, venue, bar, theater, non-profit, or individual, sign up to post all of your free events here. 
				</p>
				<p>	Get noticed, and get yourself out there, Houston!
				</p>
			</div>
		)
	}
})

var AboutNav = React.createClass({
	render: function(){
		return(
			<div id="navButtons">
				<div>
					<input type = "checkbox" id = "dropButton"></input>
					<ul id="dropdown-menu">
				      <li><a href="#home">Home</a></li>
				      <li><a href="#createEvent">Create Event</a></li>
				      <li><a href="#sign">Sign Up</a></li>
				      <li><a href="#logout">Log Out</a></li>
				    </ul>
				</div>
			</div>
		)
	}
})


var SignPop = React.createClass({

	render: function(){
		return(
			<div id="signView">
				<h3>Log in to post free Houston events. Enter a new username and password to sign up</h3>
				<SignEventbrite />
			</div>
		)
				// <SignBox sendUserInfo={this.props.sendUserInfo}/>
	}
})

var SignBox = React.createClass({
	_handleUserData: function(event){
		console.log(this.refs)
		console.log(this.refs.usernameInput.value)
		var newusr = new Parse.User(),
			username = this.refs.usernameInput.value,
			password = this.refs.passwordInput.value
		if (event.target.id === "signup"){
			newusr.set('username',username)
			newusr.set('password', password)
			newusr.signUp().then(
				function(){
					console.log("signed up!")
					location.hash = "event"
					},
					function(err){
					console.log(err)
					}
				).fail(
					function(){
						return newusr.logIn()
					}
				).then(function(){
					console.log('success!')
					location.hash = "event"
				})
			} 
		// else {
		//  return newusr.logIn().then(
		//  	// success callback
		//  	function(){
		//  		console.log("logged in!")
		// 		location.hash = "event"
		// 	},
		// 	// fail callback
		// 	function(result,err){
		// 		console.log(err)
		// 	}
		// )}
	},

	render: function(){
		return(
			<div id="signBox">
				<p>Username<input ref="usernameInput" type="text"></input></p>
				<p>Password<input ref="passwordInput" type="password"></input></p>
				<button onClick={this._handleUserData} id="signup">Log In / Sign Up</button>
			</div>
		)
	}
})

var SignEventbrite = React.createClass({
	<button><a href='https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=XSX52YKC2DDMNF4D4Q'>Log In with Eventbrite</a></button>
})

var EventView = React.createClass({

	componentWillMount: function(){
		console.log('bout to mount')
	},

	render: function(){
		console.log('rendering eventview')
		return(
			<div id="eventview">
				<EventNavBar />
				<Greeting />
				<EventForm />
			</div>
		)
	}
})

var EventNavBar = React.createClass({
	render: function(){
		return(
			<div id="navButtons">
				<div>
					<input type = "checkbox" id = "dropButton"></input>
					<ul id="dropdown-menu">
					  <li><a href="#home">Home</a></li>
				      <li><a href="#createdEvents">My Created Events</a></li>
				      <li><a href="#savedEvents">My Saved Events</a></li>
				      <li><a href="#logout">Log Out</a></li>
				    </ul>
				</div>
			</div>
		)
	}
})

var Greeting = React.createClass({
	render: function(){
		return(
			<div id="greeting">
				<h3>Hey There, </h3>
				<p>Let's Create Your Event</p>
			</div>
		)
	}
})

var EventForm = React.createClass({
	
	componentWillMount: function(){
		console.log('event form compwillmount')
	},

	_handleUserData: function(){
		var eventToSave = new Parse.Object("Event")
		var date = new Date()

		eventToSave.set('title', this._eventTitle.getDOMNode().value)
		eventToSave.set('location', this._eventLocation.getDOMNode().value)
		eventToSave.set('start_date', this._eventStartDate.getDOMNode().value)
		eventToSave.set('end_date', this._eventEndDate.getDOMNode().value)
		eventToSave.set('start_time', this._eventStartTime.getDOMNode().value)
		eventToSave.set('end_time', this._eventEndTime.getDOMNode().value)
		eventToSave.set('event_description', this._eventDescription.getDOMNode().value)

	// var eventDataObject = {
		// this.eventDataObject
		
		// console.log(eventDataObject)
		eventToSave.save()
	},

	render: function(){
		return(
			<div id="eventform">
				<p>Event Title: <input ref={(c) => this._eventTitle = c} type="text"></input></p>
				<p>Location:    <input ref={(c) => this._eventLocation = c} type="text"></input></p>
				<p>Start Date:  <input ref={(c) => this._eventStartDate = c} type="date"></input></p> 
				<p>End Date:    <input ref={(c) => this._eventEndDate = c} type="date"></input></p> 
				<p>Start Time:  <input ref={(c) => this._eventStartTime = c} type="time"></input></p> 
				<p>End Time:    <input ref={(c) => this._eventEndTime = c} type="time"></input></p>
				<p>Event Description: <textarea ref={(c) => this._eventDescription = c} rows="5"></textarea></p>
				<button onClick={this._handleUserData} id="signup">Submit Event</button>
			</div>
		)
	}
})



//-------------------------ROUTER-----------------------

var freeRouter = Backbone.Router.extend({
	routes: {
		
		'details/:listing_id':'getDetails',
		'logout':'logUserOut',
		'createEvent':'createEvent',
		'about': 'getAbout',
		'search/:date': 'showSearch',
		'home':'getHome',
		sign:'signup'
		
	},

	signup:function (argument) {
	// body...
		ReactDOM.render(<HomeView showLogin={true} events={this.fc}/>, document.querySelector('#container'))

	},

	logUserOut: function(){
		Parse.User.logOut().then(
			function(){
				location.hash = 'home'
			}
		)
		this.fc.reset()
	},

	getHomeData: function(){
		var self = this,
			date = new Date(),
			start = JSON.stringify(date);
			date.setDate(date.getDate()+1)
			var end = JSON.stringify(date),

			deferredObj = this.fc.fetch({
				data:{
					token: this.fc.token,
					'start_date.range_start': start.substring(1,start.length - 6),
					'start_date.range_end': end.substring(1,end.length - 6)
				},
				processData: true,
				dataType: 'json'
			})
		return deferredObj
	},
	getSearch: function(date){
		console.log('s')
		var self = this,
			newDate = new Date(), 
			dateArray = date.split("-")
		newDate.setFullYear(dateArray[0])
		newDate.setMonth(dateArray[1]-1)
		newDate.setDate(dateArray[2])
		console.log(newDate)

		var start = JSON.stringify(newDate);
		newDate.setDate(newDate.getDate()+1)
		var end = JSON.stringify(newDate);

			
		var deferredObj = this.fc.fetch({
			data: {
				token: self.fc.token,
				'start_date.range_start': start.substring(1,start.length - 6),
				'start_date.range_end': end.substring(1,end.length - 6)
			},
			processData: true,
			dataType:'json'
		})
		return deferredObj
	},


	showSearch: function(date){
		var boundRender = this.renderApp.bind(this)
		var self = this
		var deferredObj = this.getSearch(date)
		deferredObj.done(boundRender)
	},

	getAbout: function(){
		ReactDOM.render(<AboutView events={this.fc}/>,
			document.querySelector('#container'))
	},

	getDetailData: function(listing_id){
		console.log(this.fm)
		this.fm.set('id', listing_id)
		var self = this,
		deferredObj = this.fm.fetch ({
			data:{
				token: self.fm.token
				// id: listing_id
			},
			processData: true,
			dataType:'json'
		})
		return deferredObj
	},

	renderDetails: function(){
			console.log(this.fm)
			ReactDOM.render(<DetailsView event={this.fm} />,
			document.querySelector('#container'))
			
	},

	getDetails: function(listing_id){
		var boundRender = this.renderDetails.bind(this)
		var deferredObj = this.getDetailData(listing_id)
		deferredObj.done(function(){
			console.log('here comes the deets')
			boundRender()
		})
	},

	createEvent: function(){
		console.log("event routing")
		ReactDOM.render(<EventView />,
			document.querySelector('#container'))
		console.log('rendered event')
	},


	renderApp: function(){
		ReactDOM.render(<HomeView events={this.fc}/>, document.querySelector('#container'))
	},

	getHome: function(){
		
		var boundRender = this.renderApp.bind(this)
		var deferredObj = this.getHomeData()
			deferredObj.done(boundRender)
	},


	initialize: function(){
		// location.hash = "home"
		this.fc = new freeCollection()
		this.fm = new freeModel()
		Backbone.history.start()
	}
})

var freebie = new freeRouter

