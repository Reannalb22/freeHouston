// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	ReactDOM = require('react-dom')
	// Parse = require('parse')
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import ReactCSSTransitionReplace from 'react-css-transition-replace';


// var APP_ID: e7jWEAOxt9YSki1VgZJU5OMGsWWDphm7ZRMbgTYS,


var freeCollection = Backbone.Collection.extend({
	url:'https://www.eventbriteapi.com/v3/events/search/?venue.city=Houston&price=free',
	token:'CSHMIFYCN4CU3GOWHR5C',

	parse: function(responseData){
		// console.log(responseData)
		return responseData.events
	}
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

	_changeFormState: function(formState){
		// this.setState({formState: })
	},
_popupDecide:function(){
	if(!this.props.showLogin)return <div />
	return <SignPop formState={this.state.formState} />
},
	render: function(){

console.log('this.props.events')
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
			
			<ReactCSSTransitionReplace transitionName="fade">
				{this._popupDecide()}
				 </ReactCSSTransitionReplace>
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
				      <li role="presentation"><a href="#about">About</a></li>
				      <li role="presentation"><a href="#createEvent">Create Event</a></li>
				      <li role="presentation"><a href="#sign">Sign Up</a></li>
				      <li role="presentation"><a href="#">Log Out</a></li>
				    </ul>
				</div>
			</div>
		)
	}
})

var SearchBar = React.createClass({
	_searchHandler: function(event){
		if (event.keyCode === 13){
			var inputEl = event.target,
				keywords = inputEl.value
			location.hash = `search/${keywords}`
		}
	},

	render: function(){
		return(
			<input type="text" placeholder="Search Events i.e. tomorrow, this_weekend" onKeyDown = {this._searchHandler} />
		)
	}
})


var Event= React.createClass({
	render: function(){
		return (
			<div>
				<p>{this.props.data.get("name").text}</p>
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

var AboutView = React.createClass({
	render: function(){
		return (
			<div>
				<h3>About</h3>
				<p>	Free Houston Events is where Houstonians go to find what's happening in Houston, for free. 
				</p>
				<p>	If you're a company, venue, bar theater, non-profit or individual, sign up to post all of your free events here. 
				</p>
				<p>	Get noticed, and get yourself out there, Houston!
				</p>
			</div>
		)
	}
})


var SignPop = React.createClass({

	_handleUserData: function(event){
		// if (event.target.id === "sign"){
		// 	// sign up a user
		// 	var usr = new Parse.User()
		// 	usr.set("")
		// 	usr.signUp().then(//function to confirm signup)
		// }
		// else {
		// 	// log a user in
		// }
	},

	render: function(){
		return(
			<div id="signView">
				<h3>Sign Up to Post Free Houston Events</h3>
				<SignBox sendUserInfo={this.props.sendUserInfo}/>
				<div id="buttons">
					<button onClick={this._handleUserData} id="signup">Sign Up</button>
				</div>
			</div>
		)
	}
})

var SignBox = React.createClass({
	_getSign: function(){
		// var password = ??
		// 	username = ??
		// this.props.sendUserInfo(username,password)
	},

	render: function(){
		return(
			<div id="signBox">
				<p>Username<input type="text"></input></p>
				<p>Password<input type="password"></input></p>
			</div>
		)
	}
})
//--------------------------ROUTER-----------------------

var freeRouter = Backbone.Router.extend({
	routes: {
		
		'event':'createEvent',
		'about': 'getAbout',
		'search/:keywords': 'showSearch',
		'home':'getHome',
		sign:'signup'
		
	},

signup:function (argument) {
	// body...
		ReactDOM.render(<HomeView showLogin={true} events={this.fc}/>, document.querySelector('#container'))

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

	getSearch: function(keyword){
		console.log('s')
		var self = this,
		deferredObj = this.fc.fetch({
			data: {
				token: self.fc.token,
				'start_date.keyword' : keyword
			},
			processData: true,
			dataType:'json'
		})
		return deferredObj
	},

	// processLogin: function(username,password){
	// 	//how to login
	// 	//newUser.logIn()
	// 	//location.hash = "event"
	// }

	showSearch: function(keyword){
		var boundRender = this.renderApp.bind(this)
		var self = this
		var deferredObj = this.getSearch(keyword)
		deferredObj.done(boundRender)
	},

	getAbout: function(){
		ReactDOM.render(<AboutView />,
			document.querySelector('#container'))
	},


	createEvent: function(){
		//this works with parse to create an event for users once they sign in. 
	},

	// getLogin: function(){
	// 	ReactDOM.render(<LoginPop sendUserInfo={this.processLogin} />,
	// 		document.querySelector('#container'))
	// },


	renderApp: function(){
		ReactDOM.render(<HomeView  events={this.fc}/>, document.querySelector('#container'))
	},

	getHome: function(){
		
		var boundRender = this.renderApp.bind(this)

		var deferredObj = this.getHomeData()
			deferredObj.done(boundRender)
	},


initialize: function(){
	location.hash = "home"
	this.fc = new freeCollection()
	Backbone.history.start()
}
})

var freebie = new freeRouter

