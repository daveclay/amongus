(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{28:function(e,n,t){},29:function(e,n,t){"use strict";t.r(n);var r=t(1),a=(t(0),t(5)),o=t.n(a),c=t(3),u=t(4),i=t(11),l=t(2),s=function(e,n){return n.playerNames.map((function(n){return m(e,n)}))},m=function(e,n){return e.find((function(e){return e.name===n}))},d=function(e){return e.players[e.currentTurnPlayerIndex]},y=function(e){var n=d(e);return n?n.name:null},f=function(e,n){return y(e)===n.name},p=function(e,n){return e.rooms.find((function(e){return b(e,n)}))},b=function(e,n){return e.playerNames.includes(n.name)},j=function(e,n){var t=d(e);if(t){var r=p(e,t);return r&&r.name===n.name}return!1},g=function(e,n){var t=d(e);return t&&!j(e,n)&&!e.gameOver&&!e.emergencyMeetingStarted&&t.human},v=function(e){var n=d(e);if(n){var t=p(e,n);return n&&n.human&&!e.gameOver&&t.emergencyButton}return!1},O=function(e,n){return e.tasks.find((function(e){return e.id===n.taskId}))},h=function(e,n){return e.tasks.find((function(e){return e.id===n}))},N=function(e,n){var t=x(e,n);return j(e,t)&&null==n.playerName&&!e.gameOver&&!e.emergencyMeetingStarted&&!n.completed&&d(e).human},P=function(e,n){return j(e,n)&&d(e).human},k=function(e,n){return e.imposterPlayerName===n.name},x=function(e,n){return e.rooms.find((function(e){return e.taskId===n.id}))},I=function(e){var n=e.currentTurnPlayerIndex+1;return e.players.length===n?0:n},T=function(e,n){return e[1]>n[1]?-1:1},C=t(16),M=t(12),S={clone:function(e){return Object(C.a)(e)},allExcept:function(e,n){return e.filter((function(e){return e!==n}))},pluckRandom:function(e){return 0===e.length?null:e.splice(S.sampleIndex(e),1)[0]},sampleIndex:function(e){return Math.floor(Math.random()*e.length)},sample:function(e){return e[S.sampleIndex(e)]}},E=function(e){for(var n=arguments.length,t=new Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];return t.reduce((function(e,n){return n(e)}),e)},R=function(e){return function(n,t){return Object(M.a)(n,(function(n){return e(n,t)}))}},F=function(e){return{type:"updatePlayerName",name:e}},B=function(){return function(e,n){var t=n();null!=m(t.players,t.addPlayerForm.name)?alert("There's already a player named ".concat(t.addPlayerForm.name)):e({type:"addHumanPlayer",player:{human:!0}})}},A=function(){return{type:"addComputerPlayer",player:{human:!1}}},w=function(){return function(e,n){e({type:"startGame"}),U(e,n)}},H=function(e){return function(n,t){n({type:"onRoomSelected",roomName:e}),U(n,t)}},V=function(e){return function(n,t){n({type:"onTaskSelected",taskId:e}),U(n,t)}},G=function(){return{type:"onEmergencyMeetingSelected"}},J=function(){return function(e,n){U(e,n)}},D=function(e){return function(n,t){n({type:"voteImposter",playerName:e}),U(n,t)}},U=function(e,n){new Promise((function(t){if(function(e){if(e.emergencyMeetingStarted){var n=e.emergencyMeetingInitiatedByPlayerIndex-1;return n<0&&(n=e.players.length-1),e.currentTurnPlayerIndex===n}}(n())){var r=function(e){var n=Object.entries(e.voteTalliesByPlayer).sort(T),t=n[0],r=n[1],a={playerName:t[0],votes:t[1]},o={playerName:r[0],votes:r[1]},c=function(e){return{mostVoted:a,secondMostVoted:o,results:e}};return a.votes===o.votes?c({victory:!1,tie:!0}):a.playerName===e.imposterPlayerName?c({victory:!0}):c({victory:!1})}(n());r.results.victory?e(function(e){return{type:"votedOffImposter",voteResults:e}}(r)):(r.results.tie?e(function(e){return{type:"votedTie",voteResults:e}}(r)):e(function(e){return{type:"voteFailed",voteResults:e}}(r)),setTimeout((function(){return t()}),3e3)),e({type:"emergencyMeetingFinished"})}else 0===n().tasks.filter((function(e){return!e.completed})).length?e({type:"allTasksCompleted"}):t()})).then((function(){e({type:"nextPlayerTurn"});var t=n();!d(t).human&&t.computerPlayersEnabled&&W(e,n)}))},W=function(e,n){setTimeout((function(){var t=S.sample(z(n));e(t)}),200)},z=function(e){return e().emergencyMeetingStarted?[K]:q},K=function(e,n){var t=n();Math.random()>.5?e(D(S.sample(t.players).name)):e(J())},q=[function(e,n){var t=n(),r=S.sample(t.rooms);e(H(r.name))},function(e,n){var t=n(),r=d(t),a=p(t,r),o=O(t,a);e(V(o.id))}],L=t(13),Q=t(14),X=new(function(){function e(){Object(L.a)(this,e),this.actionsToReducers={},this.initialState={}}return Object(Q.a)(e,[{key:"map",value:function(e,n){var t="function"===typeof e?e.name:e;this.actionsToReducers[t]||(this.actionsToReducers[t]=[]);var r=this.actionsToReducers[t];r[r.length]=n}},{key:"reduce",value:function(e,n){return this.getReducersForAction(n).reduce((function(e,t){return t(e,n)}),e)}},{key:"getReducersForAction",value:function(e){var n=e.type,t=this.actionsToReducers[n];return t||(console.log("No reducer found for ".concat(n)),[])}}]),e}()),Y=function(e,n){X.map(e,n)};var Z=function(e){e.rooms.forEach((function(e){return e.playerNames=[]})),e.players.forEach((function(n){return $(e,n,"Cafeteria")}))},$=function(e,n,t){_(e,n.name);var r=function(e,n){return e.rooms.find((function(e){return e.name===n}))}(e,t);r.playerNames[r.playerNames.length]=n.name},_=function(e,n){e.rooms.forEach((function(e){e.playerNames=S.allExcept(e.playerNames,n)}))},ee=function(e){var n=d(e),t=p(e,n),r=h(e,t.taskId);(function(e,n){return n.playerName===e.name})(n,r)&&(k(e,n)?!function(e,n){return 1===e.playerNames.length&&e.playerNames[0]===n.name}(t,n)?r.compelted=!0:(console.log("".concat(n.name," sabotaged ").concat(r.description)),r.completed=!1):r.completed=!0,r.playerName=null)},ne=function(e){Z(e),function(e){e.tasks.forEach((function(e){return e.playerName=null}))}(e),e.emergencyMeetingStarted=!0,e.emergencyMeetingInitiatedByPlayerIndex=e.currentTurnPlayerIndex,te(e),e.notify={message:"Emergency Meeting!",className:"emergencyMeeting"}},te=function(e){e.players.forEach((function(n){return e.voteTalliesByPlayer[n.name]=0}))},re=function(e,n){return E(e,R((function(e){return function(e,n){if(0===e.addPlayerForm.name.length)return e;var t=Object(l.a)(Object(l.a)({},n.player),{},{name:e.addPlayerForm.name,image:S.pluckRandom(e.availablePlayerImages)});e.players[e.players.length]=t,$(e,t,"Cafeteria"),e.addPlayerForm.name=""}(e,n)})))};Y("init",(function(e){return E(e,ce,ue)})),Y("startGame",(function(e){return E(e,(function(e){return Object(l.a)(Object(l.a)({},e),{},{gameOver:!1,victory:!1})}),oe,ae,R(Z))})),Y("enableComputerPlayers",(function(e){return Object(l.a)(Object(l.a)({},e),{},{computerPlayersEnabled:!0})})),Y("updatePlayerName",(function(e,n){return Object(l.a)(Object(l.a)({},e),{},{addPlayerForm:{name:n.name}})})),Y("addHumanPlayer",re),Y("addComputerPlayer",re),Y("onRoomSelected",(function(e,n){return E(e,R((function(e){return function(e,n){var t=d(e);t&&$(e,t,n)}(e,n.roomName)})))})),Y("onTaskSelected",(function(e,n){return E(e,R((function(e){return function(e,n){var t=d(e);n===p(e,t).taskId&&(h(e,n).playerName=t.name)}(e,n.taskId)})))})),Y("nextPlayerTurn",(function(e){return E(e,(function(e){return Object(l.a)(Object(l.a)({},e),{},{currentTurnPlayerIndex:I(e)})}),R(ee),ie)})),Y("onEmergencyMeetingSelected",(function(e){return E(e,R(ne))})),Y("voteImposter",(function(e,n){return E(e,R((function(e){return function(e,n){e.voteTalliesByPlayer[n]+=1}(e,n.playerName)})))})),Y("votedOffImposter",(function(e,n){return Object(l.a)(Object(l.a)({},e),{},{gameOver:!0,notify:{message:"Victory! ".concat(n.voteResults.mostVoted.playerName," was the imposter!"),className:"victory"}})})),Y("votedTie",(function(e){return Object(l.a)(Object(l.a)({},e),{},{notify:{message:"Tie! No one was ejected.",className:"alert"}})})),Y("voteFailed",(function(e,n){return Object(l.a)(Object(l.a)({},e),{},{notify:{message:"".concat(n.voteResults.mostVoted.playerName," was NOT the imposter!"),className:"alert"}})})),Y("emergencyMeetingFinished",(function(e){return Object(l.a)(Object(l.a)({},e),{},{emergencyMeetingStarted:!1,emergencyMeetingInitiatedByPlayerIndex:null})})),Y("allTasksCompleted",(function(e){return Object(l.a)(Object(l.a)({},e),{},{gameOver:!0,notify:{message:"All tasks were completed! The Crewmates Win!",className:"victory"}})}));var ae=function(e){return Object(l.a)(Object(l.a)({},e),{},{imposterPlayerName:S.sample(e.players).name})},oe=function(e){return Object(l.a)(Object(l.a)({},e),{},{currentTurnPlayerIndex:-1})},ce=function(e){return Object(l.a)(Object(l.a)({},e),{},{availableComputerPlayers:S.clone(e.computerPlayers)})},ue=function(e){return Object(l.a)(Object(l.a)({},e),{},{availablePlayerImages:S.clone(e.playerImages)})},ie=function(e){return Object(l.a)(Object(l.a)({},e),{},{notify:{message:"".concat(y(e),"'s turn!"),className:"turn"}})},le=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:X.initialState,n=arguments.length>1?arguments[1]:void 0;return X.reduce(e,n)},se=t(15),me=Object(u.applyMiddleware)(i.a),de=Object(u.createStore)(le,{gameOver:!1,notify:{message:null},computerPlayersEnabled:!1,currentTurnPlayerIndex:-1,emergencyMeetingStarted:!1,emergencyMeetingInitiatedByPlayerIndex:null,voteTalliesByPlayer:{},computerPlayers:["Funk","Foo","Grandpop","Grandma","Preston","Mouth","Crayon"],availableComputerPlayers:[],playerImages:["blue","darkgreen","green","lightblue","orange","pink","red","white"],availablePlayerImages:[],addPlayerForm:{name:""},players:[],tasks:[{id:1,description:"Fix wiring",completed:!1,playerName:null},{id:2,description:"Unlock manifolds",completed:!1,playerName:null},{id:3,description:"Swipe card",completed:!1,playerName:null},{id:4,description:"Stabilize steering",completed:!1,playerName:null},{id:5,description:"Destroy asteroids",completed:!1,playerName:null},{id:6,description:"Fill the fuel tank",completed:!1,playerName:null}],rooms:[{name:"Cafeteria",taskId:1,playerNames:[],emergencyButton:!0},{name:"Reactor",taskId:2,playerNames:[]},{name:"Admin",taskId:3,playerNames:[]},{name:"Navigation",taskId:4,playerNames:[]},{name:"Weapons",taskId:5,playerNames:[]},{name:"Engine",taskId:6,playerNames:[]}]},Object(se.composeWithDevTools)(me));de.dispatch({type:"init"});var ye=de,fe=(t(28),Object(c.b)((function(e){return{notify:e.notify}}))((function(e){var n=e.notify;return null==n.message?"<div/>":Object(r.jsx)("div",{id:"notify",className:n.className,children:n.message})}))),pe=Object(c.b)((function(e){return{addPlayerForm:e.addPlayerForm}}),{updatePlayerName:F,addHumanPlayer:B,addComputerPlayer:A,startGame:w})((function(e){var n=e.addPlayerForm,t=e.updatePlayerName,a=e.addHumanPlayer,o=e.addComputerPlayer,c=e.startGame;return Object(r.jsxs)("div",{className:"header",children:[Object(r.jsx)("div",{className:"title",children:"AMONG US"}),Object(r.jsxs)("div",{className:"gameControls",children:[Object(r.jsxs)("div",{className:"addPlayer",children:[Object(r.jsx)("input",{id:"playerName",placeholder:"Player Name",value:n.name,onKeyUp:function(e){"Enter"===e.code&&a()},onChange:function(e){t(e.target.value)}}),Object(r.jsx)("button",{id:"addHumanPlayer",onClick:function(){return a()},children:"Add Human Player"}),Object(r.jsx)("button",{id:"addComputerPlayer",onClick:function(){return o()},children:"Add Computer Player"})]}),"|",Object(r.jsx)("button",{id:"startButton",onClick:function(){return c()},children:"Start!"})]}),Object(r.jsx)(fe,{})]})})),be=function(e,n,t){return e&&t?"playerEjected":n||t?"turnHighlight":""},je=Object(c.b)((function(e,n){return Object(l.a)(Object(l.a)({},n),{},{celebrate:e.gameOver,isCurrentTurn:f(e,n.player),votingEnabled:e.emergencyMeetingStarted,isImposter:k(e,n.player)})}),{skipVote:J,voteImposter:D})((function(e){var n=e.celebrate,t=e.player,a=e.isCurrentTurn,o=e.votingEnabled,c=e.skipVote,u=e.voteImposter,i=e.isImposter;return Object(r.jsx)("div",{className:"player ".concat(be(i,a,n)),children:Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{className:"imageContainer",children:Object(r.jsx)("img",{src:"character-images/".concat(t.image,".png")})}),Object(r.jsxs)("div",{className:"playerContent",children:[Object(r.jsx)("span",{className:"playerName",children:t.name}),Object(r.jsx)("span",{className:"status",children:a?"'s turn!":""}),Object(r.jsx)("div",{children:o?a?Object(r.jsx)("button",{className:"skipButton",onClick:function(){return c()},children:"Skip"}):Object(r.jsx)("button",{className:"voteButton",onClick:function(){return u(t.name)},children:"Vote"}):null})]})]})})})),ge=Object(c.b)((function(e,n){return Object(l.a)(Object(l.a)({},n),{},{isCurrentTurnPlayerHumanAndInRoom:P(e,x(e,n.task)),currentTurnPlayerAbleToPerformTask:N(e,n.task)})}),{onTaskSelected:V})((function(e){var n=e.task,t=e.currentTurnPlayerAbleToPerformTask,a=e.isCurrentTurnPlayerHumanAndInRoom,o=e.onTaskSelected;return Object(r.jsx)("div",{className:"task ".concat(t?"selectable":""),onClick:function(e){t&&o(n.id),e.stopPropagation()},children:Object(r.jsx)("div",{className:"description",children:n.playerName?"".concat(n.playerName," is performing ").concat(n.description):n.completed&&a?"".concat(n.description," completed"):n.description})})})),ve=Object(c.b)((function(e){return{emergencyMeetingStarted:e.emergencyMeetingStarted,emergencyMeetingButtonEnabled:v(e)}}),{onEmergencyMeetingSelected:G})((function(e){var n=e.emergencyMeetingButtonEnabled,t=e.emergencyMeetingStarted,a=e.onEmergencyMeetingSelected;return Object(r.jsx)("button",{disabled:!n,onClick:function(){t||a()},id:"emergencyMeetingButton",children:"Emergency Meeting!"})})),Oe=Object(c.b)((function(e,n){return{room:n.room,players:e.players,task:O(e,n.room),currentTurnPlayerAbleToSelectRoom:g(e,n.room)}}),{onRoomSelected:H})((function(e){var n=e.room,t=e.players,a=e.task,o=e.currentTurnPlayerAbleToSelectRoom,c=e.onRoomSelected;return Object(r.jsxs)("div",{className:"room",onClick:function(){o&&c(n.name)},children:[Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{className:"roomName",children:n.name}),Object(r.jsx)("div",{className:"taskContainer",children:Object(r.jsx)(ge,{task:a})}),n.emergencyButton?Object(r.jsx)(ve,{}):null]}),Object(r.jsx)("div",{className:"players",children:s(t,n).map((function(e){return Object(r.jsx)(je,{player:e},e.name)}))})]})})),he=Object(c.b)((function(e){return{rooms:e.rooms}}))((function(e){var n=e.rooms;return Object(r.jsx)("div",{children:n.map((function(e){return Object(r.jsx)(Oe,{room:e},e.name)}))})}));var Ne=function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsx)(pe,{}),Object(r.jsx)(he,{})]})},Pe=document.getElementById("root");o.a.render(Object(r.jsx)(c.a,{store:ye,children:Object(r.jsx)(Ne,{})}),Pe);var ke=[function(){return F("Jackson")},function(){return B()},function(){return F("Daddy")},function(){return B()},function(){return F("Foo")},function(){return{type:"addComputerPlayer",player:{human:!1}}},function(){return F("Baz")},function(){return{type:"addComputerPlayer",player:{human:!1}}},function(){return w()},function(){return V(1)},function(){return H("Reactor")},function(){return H("Navigation")},function(){return V(3)},function(){return{type:"onEmergencyMeetingSelected"}},function(){return D("Foo")},function(){return D("Foo")},function(){return J()},function(){return D("Jackson")},function(){return{type:"enableComputerPlayers"}}],xe=0,Ie=setInterval((function(){return console.log(ke[xe]),ye.dispatch(ke[xe]()),void(++xe===ke.length&&clearInterval(Ie))}),100)}},[[29,1,2]]]);
//# sourceMappingURL=main.7923eb7f.chunk.js.map