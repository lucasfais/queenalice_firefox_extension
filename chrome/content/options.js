var queenaliceOptions = {
  
  load_account: function() {
    var loginInfo = queenaliceAccount.get_login_info();
    
    if (loginInfo) {
      document.getElementById('queenalice_username').value = loginInfo.username;
      document.getElementById('queenalice_password').value = loginInfo.password;
    }
  },
  
  ok: function() {
    var username = document.getElementById('queenalice_username').value;
    var password = document.getElementById('queenalice_password').value;
    
    queenaliceAccount.save(username, password);
    self.close();
  },
  
  cancel: function() {
    self.close();
  }
}

window.onload = function() { 
  queenaliceOptions.load_account(); 
}
