
var queenalice = {
  MYGAMES_URL: 'http://www.queenalice.com/mygames.php',
  username: "",
  password: "",
  prefservice: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces['nsIPrefService']).getBranch('extensions.queenalice.'),
  
  init: function() {

    this.prefservice.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefservice.addObserver("", this, false);

    this.username = this.prefservice.getCharPref('username');
    this.password = this.prefservice.getCharPref('password');
    
    this.get_pending_games();
  },
  
  get_pending_games: function() {
    $.post(queenalice.MYGAMES_URL, {username: queenalice.username, password: queenalice.password}, function(data){

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
    gBrowser.selectedTab = getBrowser().addTab(this.MYGAMES_URL); 
  },
  
  observe: function() {
    this.username = this.prefservice.getCharPref('username');
    this.password = this.prefservice.getCharPref('password');
    this.get_pending_games();
  }
}
 
$(document).ready(function(){
  queenalice.init();
  window.setInterval(queenalice.get_pending_games, 3*60*1000);
});