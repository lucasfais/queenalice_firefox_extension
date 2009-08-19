var queenaliceAccount = {
  hostname: 'chrome://queenalice',
  formSubmitURL: null,
  httprealm: 'QueenAlice Account',
  passwordManager: Components.classes["@mozilla.org/login-manager;1"]
                  .getService(Components.interfaces.nsILoginManager),
  
  save: function(username, password) {
    
    var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                                 Components.interfaces.nsILoginInfo,
                                                 "init");
    
    // Build new login
    var newLoginInfo = new nsLoginInfo(this.hostname, this.formSubmitURL, this.httprealm,
                                      username, password, "username", "password");
    
    var oldLoginInfo = this.get_login_info();
                                      
    if (oldLoginInfo) {
      this.passwordManager.modifyLogin(oldLoginInfo, newLoginInfo);
    }
    else {
      this.passwordManager.addLogin(newLoginInfo);
    }
    
  },
  
  get_login_info: function() {
    var logins = this.passwordManager.findLogins({}, this.hostname, this.formSubmitURL, this.httprealm);
    
    if (logins.length > 0) {
      return logins[0];
    }
    else {
      return null;
    }
  }
}