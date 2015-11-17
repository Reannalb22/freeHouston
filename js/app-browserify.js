// es5 and 6 polyfills, powered by babel
require("babel/polyfill")
let fetch = require('./fetcher')
//this is the correct push!
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


import HomeView from "./HomeView.js"
import DetailsView from "./DetailsView.js"
import EventView from "./EventView.js"
import AboutView from "./AboutView.js"


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

