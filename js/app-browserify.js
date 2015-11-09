// es5 and 6 polyfills, powered by babel
require("babel/polyfill")
let fetch = require('./fetcher')
//this push is correctooooo.
var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	ReactCSSTransitionReplace = require('react-css-transition-replace'),
	Parse = require('parse')
	// ReactCSSTransitionGroup = require('react-addons-css-transition-group');
console.log('loaded')
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

	parse: function(response){
		return {
			name: response.name.text,
			description: response.description.text,
			start: response.start.local,
			end: response.end.local,
			logo: response.logo.url
		}
	},

	token: 'CSHMIFYCN4CU3GOWHR5C'

})


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
			<h1 className = "animated fadeInUp"> H-Town Underground </h1>
		)
	}
})

var NavBar = React.createClass({
	render: function(){

		var signUpStyle,
			logOutStyle,
			createEventStyle,
			myEventsStyle

		if (Parse.User.current({true})){
			signUpStyle = {display: "none"},
			logOutStyle = {display: "block"},
			createEventStyle = {display:"block"},
			myEventsStyle = {display:"block"}
		}

		else { 
			signUpStyle = {display:"block"},
			logOutStyle = {display:"none"},
			createEventStyle = {display: "none"},
			myEventsStyle = {display:"none"}
		}


		return(
			<div id="navButtons">
				<div>
					<input type = "checkbox" id = "dropButton"></input>
					<ul id="dropdown-menu">
				      <li><a href="#home">Home</a></li>
				      <li><a href="#about">About</a></li>
				      <li style={signUpStyle} ><a href="#sign">Log In</a></li>
				      <li style={createEventStyle}><a href="#event">Create Event</a></li>
				      <li style={logOutStyle} ><a href="#logout">Log Out</a></li>
				    </ul>
				</div>
			</div>
		)
	}
})

//feature to add later
//<li style={myEventsStyle}><a href="#myCreatedEvents">My Created Events</a></li>

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
		console.log(this.props)
		if(this.props.data.attributes){
			var id = this.props.data.attributes.id
			var name = this.props.data.get("name").text
		}
		else{
		 	var id = this.props.data.id
		 	var name = this.props.data.name.text
		}
		return (
			<div>
				<p onClick = {this._clickEvent} id={id}>{name}</p>
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
		return <div id = "listEvent">{componentArray}</div>
	}
})

var DetailsView = React.createClass({
	render: function(){
		console.log(this.props.event)
		return(
			<div id="detailView">
				<NavBar />
				<Details event = {this.props.event} />
			</div>
		)
	}
})

var Details = React.createClass({
	render: function(){
		var name = this.props.event.attributes.name
	
		var start = new Date(this.props.event.attributes.start) 
		var sDate = start.toLocaleDateString()
		console.log(start)
		
		var sTime = start.toLocaleTimeString().replace(':00', '')
		
		var end = new Date(this.props.event.attributes.end) 
		var eDate = end.toLocaleDateString()
		console.log(end)

		var finalDate

		if (sDate === eDate){
			finalDate = sDate
		}
		else finalDate = `${sDate} to ${eDate}`
		
		var eTime = end.toLocaleTimeString().replace(':00', '')

		var description = this.props.event.attributes.description
		
		var logo
		if(this.props.event.attributes.logo) {
			logo = this.props.event.attributes.logo
		}
		else logo = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Panoramic_Houston_skyline.jpg'
		
		return(
			<div id="details">
				<h3>{name}</h3>
				<img src = {logo} />
				<p id="date"><strong>{finalDate} </strong></p>
				<p id="time"><strong>{sTime} to {eTime} </strong></p>
				<p id="description">{description}</p>
			</div>
		)
	}
})



var AboutView = React.createClass({
	render: function(){
		return (
			<div id="aboutview">
				<NavBar />
				<div id="movieDiv">
					<video controls muted autoPlay loop poster = './images/freeHouston_vid/sun.png'>
						<source src = './images/freeHouston_vid/dance.mp4' />
					</video>
				</div>
				<div id="aboutDiv">
					<h3>Why HTU?</h3>
					<p>	H-Town Underground is where Houstonians go to find what's happening in Houston, for free. No more guessing, planning, or Googling-- your spur of the moment plans have just been made. 
					Know of an awesome free event happening in Houston? Giving out freebies? Allowing no cover until a certain time? Sign up to post all of your free Houston events here. 
					Bonus: H-Town Underground's mission is to get these fantastic freebies out in the open, so your event will post here and on Eventbrite for your convenience. 
					Get noticed, and get yourself out there, Houston!
					</p>
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
				<SignBox sendUserInfo={this.props.sendUserInfo}/>
			</div>
		)
				
				//<SignEventbrite />
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
			// make api call to 
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
					// Backbone.navigate('event',{trigger:true})
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
				<p>Username  <input ref="usernameInput" type="text"></input></p>
				<p>Password  <input ref="passwordInput" type="password"></input></p>
				<button onClick={this._handleUserData} id="signup">Log In / Sign Up</button>
			</div>
		)
	}
})

//in order to have user sign themselves into eventbrite... right now I'm using my own account and I'm posting on user's behalf

// var SignEventbrite = React.createClass({
// 	render: function(){
// 		return(
// 				<button><a href='https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=XSX52YKC2DDMNF4D4Q'>Log In with Eventbrite</a></button>
// 		)
// 	}
// })

var EventView = React.createClass({

	componentWillMount: function(){
		console.log('bout to mount')
	},

	render: function(){
		console.log('rendering eventview')
		return(
			<div id="eventview">
				<NavBar />
				<Greeting />
				<EventForm />
			</div>
		)
	}
})


//another feature perhaps to add later
//<li><a href="#savedEvents">My Saved Events</a></li>

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

			eventToSave.set('username', Parse.User.current().id)
			eventToSave.set('name', this._eventTitle.getDOMNode().value)
			eventToSave.set('location', this._eventLocation.getDOMNode().value)
			eventToSave.set('start', this._eventStartDate.getDOMNode().value + "T" + this._eventStartTime.getDOMNode().value + ":00Z")
			eventToSave.set('end', this._eventEndDate.getDOMNode().value + "T" + this._eventEndTime.getDOMNode().value + ":00Z")
			eventToSave.set('description', this._eventDescription.getDOMNode().value)

		eventToSave.save()
	},

	render: function(){
		return(
			<div id="eventform">
				<div>
					<div id="titles">
						<p>Event Name</p>
						<p>Location</p>
						<p>Start Date</p>
						<p>End Date</p>
						<p>Start Time</p>
						<p>End Time</p>
						<p>Capacity</p>
						<p>Event Description</p>
					</div>

					<div id="inputs">
						<p>  <input ref={(c) => this._eventTitle = c} type="text"></input></p>
						<p>  <input ref={(c) => this._eventLocation = c} type="text"></input></p>
						<p>  <input ref={(c) => this._eventStartDate = c} type="date"></input></p> 
						<p>  <input ref={(c) => this._eventEndDate = c} type="date"></input></p> 
						<p>  <input ref={(c) => this._eventStartTime = c} type="time"></input></p> 
						<p>  <input ref={(c) => this._eventEndTime = c} type="time"></input></p>
						<p>  <textarea ref={(c) => this._eventDescription = c} rows="5"></textarea></p>
					</div>
				</div>
				
				<button onClick={this._handleUserData} id="signup">Submit Event</button>
			</div>
		)}
	}
)

// var myCreatedEventView= React.createClass({
// 	render: function(){
// 		return(
// 			<div id="myCreated">
// 				<NavBar />
// 				<ListEvents events = {this.props.events} />
// 			</div>
// 		)
// 	}
// })



//<li><a href="#event">Create Event</a></li>


//-------------------------ROUTER-----------------------

var freeRouter = Backbone.Router.extend({
	routes: {
		
		'details/:listing_id':'getDetails',
		'logout':'logUserOut',
		// 'myCreatedEvents':'showMyEvents',
		'event':'createEvent',
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

	getParseData: function(date){
		if (!date){

			var today = new Date()
			var month = today.getMonth()
			var day = today.getDate()
			if (month.length < 2){
				var month = '0' + today.getMonth() 
			}

			if (day.length < 2){
				var day = '0' + today.getDate()
			}
			
			date = today.getFullYear() + "-" + month + "-" + day 
			}
		// var Event = Parse.Object.extend("Event");
		var query = new Parse.Query("Event")
		query.contains('start',date)
		return query.find()
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

// pDeffered=getParseData(date)
			
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
		var eventBriteDeferred = this.getHomeData()
		var parseDeferred = this.getParseData()
		$.when(eventBriteDeferred, parseDeferred).then(function(){
			alert('both queries finished!')
			console.log(arguments)
			window.arguments
		})
	},




	initialize: function(){
		// location.hash = "home"
		this.fc = new freeCollection()
		this.fm = new freeModel()
		Backbone.history.start()
	}
})

var freebie = new freeRouter


// $.ajax({
// 	url: "https://www.eventbriteapi.com/v3/events/",
// 	data: {
// 		        'event.name.html': 'tea_party',
// 		        'event.start.utc': "2015-11-14T20:00:00Z",
// 		        'event.end.utc': "2015-11-15T03:00:00Z",
// 		        'event.start.timezone': 'Africa/Nouakchott',
// 		        'event.end.timezone': 'Africa/Nouakchott',
// 		        'event.currency': 'USD',
// 		        'event.description.html': "let's have a tea party in africa", 
// 		        'event.listed': true,
// 		        'event.online_event': true,
// 		        token: "RFJVFZFYRORRQSOUJG2L"
// 		    },
// 	method: "POST",
// 	headers: {
// 		"Authorization": "bearer RFJVFZFYRORRQSOUJG2L"
// 	}
// }).fail(function(err1,err2){
// 	console.log(err1)
// 	console.log(err2)
// }).done(function(resp){
// 	console.log(resp)
// })

// 2015-11-14T20:00:00Z how to format date and time