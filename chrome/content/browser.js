const QUEENALICE_URL = 'http://www.queenalice.com'
const QUEENALICE_GAME_URL = QUEENALICE_URL + '/game.php';
const QUEENALICE_MYGAMES_URL = QUEENALICE_URL + '/mygames.php';

var queenalice = {
  
  init: function() {
    this.registerLoginObserver();
    this.get_pending_games();
  },
  
  get_pending_games: function() {
    
    var panel_text = '';
    var panel_tooltip = 'Set up an account on Preferences';
    var loginInfo = queenaliceAccount.get_login_info();
    
    if (loginInfo) {
      $.post(QUEENALICE_MYGAMES_URL, {username: loginInfo.username, password: loginInfo.password}, function(data){

        var gamesWaintingRe = new RegExp("(\\d+) games? waiting", "g");
        var gamesWaitingMatches = gamesWaintingRe.exec(data);

        var panel_text = '';
        var panel_tooltip = 'No game waiting your move';
        
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
    }
    
    var panel = document.getElementById('queenalice-status_panel');
    panel.label = panel_text;
    panel.setAttribute("tooltiptext", panel_tooltip);
  },
  
  open_mygames: function () {
    gBrowser.selectedTab = getBrowser().addTab(QUEENALICE_GAME_URL); 
  },
  
  registerLoginObserver: function() {
    var observerService = Components.classes["@mozilla.org/observer-service;1"]
                          .getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(this, "passwordmgr-storage-changed", false);
  },
  
  observe: function() {
    this.get_pending_games();
  }
}
 
$(document).ready(function(){
  queenalice.init();
  window.setInterval(queenalice.get_pending_games, 2*60*1000);
});