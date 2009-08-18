const QUEENALICE_GAMES_URL = 'http://www.queenalice.com/game.php';
var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces['nsIPrefService']).getBranch('extensions.queenalice.');

var queenalice = {
  
  init: function() {
    prefservice.QueryInterface(Components.interfaces.nsIPrefBranch2);
    prefservice.addObserver("", this, false);

    this.get_pending_games();
  },
  
  get_pending_games: function() {
    var username = prefservice.getCharPref('username');
    var password = prefservice.getCharPref('password');
    
    $.post(QUEENALICE_GAMES_URL, {username: username, password: password}, function(data){

      var gamesWaintingRe = new RegExp("(\\d+) games? waiting", "g");
      var gamesWaitingMatches = gamesWaintingRe.exec(data);

      var panel_text = '';
      var panel_tooltip = 'None game waiting your move';
      if (gamesWaitingMatches && gamesWaitingMatches.length > 0) {
        panel_text = gamesWaitingMatches[1];
        panel_tooltip = gamesWaitingMatches[0] + ' your move';
      }
      else {
        var invalidLoginRe = new RegExp("Invalid username or password", "g");
        var invalidLoginMatches = data.match(invalidLoginRe);

        if (invalidLoginMatches && invalidLoginMatches.length > 0) {
          panel_tooltip = "Invalid username or password";
        }
      }

      var panel = document.getElementById('queenalice-status_panel');
      panel.label = panel_text;
      panel.setAttribute("tooltiptext", panel_tooltip);
    });
  },
  
  open_mygames: function () {
    gBrowser.selectedTab = getBrowser().addTab(QUEENALICE_GAMES_URL); 
  },
  
  observe: function() {
    this.get_pending_games();
  }
}
 
$(document).ready(function(){
  queenalice.init();
  window.setInterval(queenalice.get_pending_games, 2*60*1000);
});