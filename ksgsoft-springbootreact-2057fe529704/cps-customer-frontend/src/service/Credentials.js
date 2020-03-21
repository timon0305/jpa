
const key = 'credentials';

function Credentials(token, refresh, expires, created, privileges, profile) {
  this.token = token;
  this.refresh = refresh;
  this.expires = expires;
  this.privileges = privileges;
  this.created = created;
  this.profile = profile;
}

// Read from NetworkResponse data
Credentials.fromResponse = function({oauthToken, refreshToken, expiresIn, privileges, profile}){
  return new Credentials(oauthToken, refreshToken, expiresIn * 1000, new Date().getTime(), privileges, profile);
};

// Read write from State object.
Credentials.fromState = function({token, refresh, expires, created, privileges, profile}) {
  return new Credentials(token, refresh, expires, created, privileges, profile);
};

Credentials.prototype.toState = function(){
  let result = {
    token: this.token,
    refresh:this.refresh,
    expires:this.expires,
    privileges:this.privileges,
    created: this.created,
    profile: this.profile,
    // This property is for routing.
    isAuthenticated: this.isValid() && (this.isTokenValid() || this.isRefreshTokenValid())
  };

  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });

  return result;
};

// Read write from Local Storage Object.
Credentials.fromStorage = function(){
  try {
    const base64 = localStorage.getItem(key);
    const json = window.atob(base64 || "");

    const {token, refresh, expires, created, privileges, profile} = JSON.parse(json);
    return new Credentials(token, refresh, expires, created, privileges, profile);
  }catch(e){}
  return new Credentials();
};

Credentials.prototype.save2Storage = function(){
  try {
    const json = JSON.stringify(this.toState());
    localStorage.setItem(key, window.btoa(json));
  }catch(e){}
};

Credentials.clearStorage = function(){
  localStorage.removeItem(key);
};

Credentials.prototype.isValid = function(){
  return (this.token && this.expires && !isNaN(this.expires) && this.created && !isNaN(this.created));
};

Credentials.prototype.isTokenValid = function() {
  const now = new Date().getTime();
  return this.isValid() && now < (this.created + this.expires - 3000);    //Delta is 3 seconds
};

Credentials.prototype.isRefreshTokenValid = function(){
  const now = new Date().getTime();
  const refreshTokenValidity = 2592000 * 1000;    // a month.
  return this.isValid() && this.refresh &&  now < (this.created + refreshTokenValidity - 60000) // Delta is 1 minute.
};

export default Credentials;
