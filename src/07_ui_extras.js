/*  
	Paella HTML 5 Multistream Player
	Copyright (C) 2017  Universitat Politècnica de València Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
*/



Class ("paella.LoaderContainer", paella.DomNode,{
	timer:null,
	loader:null,
	loaderPosition:0,

	initialize:function(id) {
		this.parent('div',id,{position:'fixed',backgroundColor:'white',opacity:'0.7',top:'0px',left:'0px',right:'0px',bottom:'0px',zIndex:10000});
		this.loader = this.addNode(new paella.DomNode('i','',{
			width: "100px",
			height: "100px",
			color: "black",
			display: "block",
			marginLeft: "auto",
			marginRight: "auto",
			marginTop: "32%",
			fontSize: "100px",
		}));
		this.loader.domElement.className = "icon-spinner";

		paella.events.bind(paella.events.loadComplete,(event,params) => { this.loadComplete(params); });
		this.timer = new base.Timer((timer) => {
			//thisClass.loaderPosition -= 128;
			
			//thisClass.loader.domElement.style.backgroundPosition = thisClass.loaderPosition + 'px';
			this.loader.domElement.style.transform = `rotate(${ this.loaderPosition }deg`;
			this.loaderPosition+=45;
		},250);
		this.timer.repeat = true;
	},

	loadComplete:function(params) {
		$(this.domElement).hide();
		this.timer.repeat = false;
	}
});

Class ("paella.KeyManager", {
	isPlaying:false,
	Keys:{Space:32,Left:37,Up:38,Right:39,Down:40,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90},

	enabled:true,

	initialize:function() {
		var thisClass = this;
		paella.events.bind(paella.events.loadComplete,function(event,params) { thisClass.loadComplete(event,params); });
		paella.events.bind(paella.events.play,function(event) { thisClass.onPlay(); });
		paella.events.bind(paella.events.pause,function(event) { thisClass.onPause(); });
	},

	loadComplete:function(event,params) {
		var thisClass = this;
		paella.events.bind("keyup",function(event) { thisClass.keyUp(event); });
	},

	onPlay:function() {
		this.isPlaying = true;
	},

	onPause:function() {
		this.isPlaying = false;
	},

	keyUp:function(event) {
		if (!this.enabled) return;

		// Matterhorn standard keys
		if (event.altKey && event.ctrlKey) {
			if (event.which==this.Keys.P) {
				this.togglePlayPause();
			}
			else if (event.which==this.Keys.S) {
				this.pause();
			}
			else if (event.which==this.Keys.M) {
				this.mute();
			}
			else if (event.which==this.Keys.U) {
				this.volumeUp();
			}
			else if (event.which==this.Keys.D) {
				this.volumeDown();
			}
		}
		else { // Paella player keys
			if (event.which==this.Keys.Space) {
				this.togglePlayPause();
			}
			else if (event.which==this.Keys.Up) {
				this.volumeUp();
			}
			else if (event.which==this.Keys.Down) {
				this.volumeDown();
			}
			else if (event.which==this.Keys.M) {
				this.mute();
			}
		}
	},

	togglePlayPause:function() {
		if (this.isPlaying) {
			paella.player.pause();
		}
		else {
			paella.player.play();
		}
	},

	pause:function() {
		paella.player.pause();
	},

	mute:function() {
		var videoContainer = paella.player.videoContainer;
		videoContainer.volume().then(function(volume){
			var newVolume = 0;
			if (volume==0) { newVolume = 1.0; }
			paella.player.videoContainer.setVolume({ master:newVolume, slave: 0});
		});
	},

	volumeUp:function() {
		var videoContainer = paella.player.videoContainer;
		videoContainer.volume().then(function(volume){
			volume += 0.1;
			volume = (volume>1) ? 1.0:volume;
			paella.player.videoContainer.setVolume({ master:volume, slave: 0});			
		});
	},

	volumeDown:function() {
		var videoContainer = paella.player.videoContainer;
		videoContainer.volume().then(function(volume){
			volume -= 0.1;
			volume = (volume<0) ? 0.0:volume;
			paella.player.videoContainer.setVolume({ master:volume, slave: 0});
		});
	}
});

paella.keyManager = new paella.KeyManager();
