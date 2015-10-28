// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react'),
	ReactDOM = require('react-dom')
	// Parse = require('parse')


var freeCollection = Backbone.Collection.extend({
	url:'https://www.eventbriteapi.com/v3/events/search/?venue.city=Houston&price=free',
	token:'CSHMIFYCN4CU3GOWHR5C',

	parse: function(responseData){
		console.log(responseData)
		return responseData.events
	}
})

// key: 'XSX52YKC2DDMNF4D4Q'

// client_secret: '4UVXHV53T7S36JQABUWC2IEDMVKWCFDQQQEDMLU4475QHPPZTF'

// OAuth_token: 'RFJVFZFYRORRQSOUJG2L' 

// Anon_access_token: 'CSHMIFYCN4CU3GOWHR5C'


var HomeView = React.createClass({
	render: function(){

console.log(this.props.events)
		return (
			<div id="homeView">
				<TitleBar />
				<SearchBar />
				<ListEvents events = {this.props.events} />
			</div>
		)
	}
})


var TitleBar = React.createClass({
	render: function(){
		return(
			<h1> Houston Free Events </h1>
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
			<input type="text" placeholder="Search Events i.e. tonight, tomorrow, this weekend" onKeyDown = {this._searchHandler} />
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
		console.log(eventObj)
		return <Event key={eventObj.id} data={eventObj} />
	},

	render: function(){
		var events = this.props.events, 
			componentArray = events.map(this._renderEvent)
console.log(events)
		return <div>{componentArray}</div>
	}
})


var freeRouter = Backbone.Router.extend({
	routes: {
		'search/:keywords': 'showSearch',
		'home':'getHome'
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

	showSearch: function(keyword){
		var boundRender = this.renderApp.bind(this)
		var self = this
		var deferredObj = this.getSearch(keyword)
		deferredObj.done(boundRender)
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
	location.hash = "home"
	this.fc = new freeCollection()
	Backbone.history.start()
}
})

var freebie = new freeRouter

