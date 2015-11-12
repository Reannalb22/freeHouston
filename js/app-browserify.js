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
window.pp=[]
window.Parse = Parse
window.React = React
window.$=$
var APP_ID = 'e7jWEAOxt9YSki1VgZJU5OMGsWWDphm7ZRMbgTYS',
	JS_KEY = 'GA1OcaDeYAVWaGVVPnCVwbEnn4Muej6YKMi3p1Mh',
	REST_API_KEY = 'tNF3vLrlnjgozpu8tMC6aKLleLxww8R5fqpwfpcP'

Parse.initialize(APP_ID,JS_KEY)

var freeModel = Backbone.Model.extend({
	url : function(){
		return `https://www.eventbriteapi.com/v3/events/${this.get('id')}/`
	},

	parse: function(response){
		console.log(response)
		return {
			name: response.name.text,
			description: response.description.text,
			start: response.start.local,
			end: response.end.local,
			logo: response.logo ? response.logo.url : null,
			id: response.id,
			source: function(){return 'ebrite'} 
		}
	},

	token: 'CSHMIFYCN4CU3GOWHR5C'
})
var freeCollection = Backbone.Collection.extend({
	url:'https://www.eventbriteapi.com/v3/events/search/?venue.city=Houston&price=free',
	token:'CSHMIFYCN4CU3GOWHR5C',
	model: freeModel,
	parse: function(responseData){
		return responseData.events//.map(r=>{r.source='ebrite';return r})
	}
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
console.log('different 4')
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
			<div>
				<h1 className = "animated fadeInUp"> H-Town Underground </h1>
				<i className="material-icons">keyboard_arrow_down</i>
			</div>
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
					<i className="material-icons">view_headline</i>
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
var Event = React.createClass({

	_clickEvent: function(event){
		var detailClick = event.target,
			detailId = detailClick.id,//||detailClick.objectId;
			source = this.props.data.get("source")()
		location.hash = `details/${source}/${detailId}`
	},

	render: function(){
		window.pp.push(this.props)
		console.log(this.props)
		
		var id
			if(this.props.data.attributes.id){
				id = this.props.data.get('id')
			} else {
				id = this.props.data.id
			}
		
		var name = this.props.data.get("name")
		
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
		
		var timeFormat = function(dateObj){
			var time = dateObj.toUTCString().split(" ")[4] 
			//sTime now looks like "18:00:00". I'm going to separate the hours to get 
			//it out of military time and decide if it's AM or PM

			var hour = time.split(":")[0]
			var minute = time.split(":")[1]  
			var ampm = "am"
			if(hour > 12){
				hour -= 12
				ampm = "pm"
			}

			return hour + ":" + minute +" "+ ampm
		}

		var end = new Date(this.props.event.attributes.end), 
			eDate = end.toLocaleDateString(),
			formattedStart = timeFormat(start),
			formattedEnd = timeFormat(end)
		
		var finalDate

		if (sDate === eDate){
			finalDate = sDate
		}
		else finalDate = `${sDate} to ${eDate}`
	
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
				<p id="time"><strong>{formattedStart} to {formattedEnd} </strong></p>
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
					<p id="about">	H-Town Underground is where Houstonians go to find what's happening in Houston, for free. No more guessing, planning, or Googling. Your spur of the moment plans have just been made. 
					Know of an awesome free event happening in Houston? Giving out freebies? Allowing no cover until a certain time? Sign up to post all of your free Houston events here. 
					Get noticed, and get yourself out there, Houston!
					</p>
					<p id="credit"> Video Credit: Remy Golinelli (RG) </p>
				</div>
			</div>
		)
	}
})
//<p id="vidcred.">Video Credit: Remy Golinelli</p>
var SignPop = React.createClass({

	render: function(){
		return(
			<div id="signView">
				<h3>Log in to post free Houston events. Enter a new username and password to sign up</h3>
				<SignBox sendUserInfo={this.props.sendUserInfo}/>
			</div>
		)
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
var Greeting = React.createClass({
	render: function(){
		return(
			<div id="greeting">
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
			eventToSave.set('start', this._eventStartDate.getDOMNode().value + "T" + this._eventStartTime.getDOMNode().value + ":00Z")
			eventToSave.set('end', this._eventEndDate.getDOMNode().value + "T" + this._eventEndTime.getDOMNode().value + ":00Z")
			eventToSave.set('description', this._eventDescription.getDOMNode().value)

		eventToSave.save().then(location.hash = "home")
		// alert("Your Event Has Posted!")
		
	},

	render: function(){
		return(
			<div id="eventform">
				<div>
					<div id="titles">
						<p>Event Name</p>
						<p>Start Date</p>
						<p>End Date</p>
						<p>Start Time</p>
						<p>End Time</p>
						<p>Event Description</p>
					</div>

					<div id="inputs">
						<p>  <input ref={(c) => this._eventTitle = c} type="text"></input></p>
						<p>  <input ref={(c) => this._eventStartDate = c} type="date"></input></p> 
						<p>  <input ref={(c) => this._eventEndDate = c} type="date"></input></p> 
						<p>  <input ref={(c) => this._eventStartTime = c} type="time"></input></p> 
						<p>  <input ref={(c) => this._eventEndTime = c} type="time"></input></p>
						<p>  <textarea ref={(c) => this._eventDescription = c} rows="5" placeholder="Please include location and other details regarding this event"></textarea></p>
					</div>
				</div>
				
				<button onClick={this._handleUserData} id="signup">Submit Event</button>
			</div>
		)
	}
})


//-------------------------ROUTER-----------------------

var freeRouter = Backbone.Router.extend({
	routes: {
		
		'details/:source/:listing_id':'getDetails',
		'logout':'logUserOut',
		'event':'createEvent',
		'about': 'getAbout',
		'search/:date': 'showSearch',
		'home':'getHome',
		sign:'signup'	
	},

	signup:function (argument){
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
			var month = today.getMonth() + 1
			var day = today.getDate()
			if (month.toString().length < 2){
				var month = '0' + today.getMonth() 
			}

			if (day.toString().length < 2){
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
		var eventBriteDeferred = this.getSearch(date)
		var parseDeferred= this.getParseData(date)
		var self = this

		// eventBriteDeferred.done(boundRender)
		$.when(eventBriteDeferred, parseDeferred).then(function(res1,res2){
			var bigArray = res2._result[0].map(r=>{r.set({source:function(){return 'p'}});return r})
			
			self.fc.models.forEach(function(model){
				bigArray.push(model)
			})
			ReactDOM.render(<HomeView events={bigArray}/>, document.querySelector('#container'))
		})
	},

	getAbout: function(){
		ReactDOM.render(<AboutView events={this.fc}/>,
			document.querySelector('#container'))
	},

	//parse query, query.find
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

	getParseDetails: function(listing_id){
		var query = new Parse.Query("Event")
		query.contains('objectId',listing_id)
		return query.find()
	},

	renderParseDetails: function(results){
		ReactDOM.render(<DetailsView event={results}/>, document.querySelector('#container'))
	},

	getDetails: function(source,listing_id){
		var self = this 
		if (source === 'p'){
			
			// var boundRender = this.renderParseDetails.bind(this)

			var parseDeferred = this.getParseDetails(listing_id)

			parseDeferred.done(function(results){
				self.renderParseDetails(results[0])
			})

		} else {

			var boundRender = this.renderDetails.bind(this)

			var eventBritedeferredObj = this.getDetailData(listing_id)
		
			eventBritedeferredObj.done(function(){
				
				boundRender()
			})
		}
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
		var self = this

		$.when(eventBriteDeferred, parseDeferred).then(function(res1,res2){
			var bigArray = res2._result[0].map(r=>{r.set({source:function(){return 'p'}});return r})
			
			self.fc.models.forEach(function(model){
				bigArray.push(model)
			})
			ReactDOM.render(<HomeView events={bigArray}/>, document.querySelector('#container'))
		})
	},

	initialize: function(){
		location.hash = "home"
		this.fc = new freeCollection()
		this.fm = new freeModel()
		Backbone.history.start()
	}
})

var freebie = new freeRouter