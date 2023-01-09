
const isValidRequest = function(data){
    if(Object.keys(data).length == 0){
      return false
    }
    return true
  }

const isValidName = function(name){
    return /^[a-z A-Z]+$/.test(name)
} 

const isValidEmail = function (email) {
    return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email);
};

const isValidPhone = function(phone){
    return  /^((\+91(-| )+)|0)?[6-9][0-9]{9}$/.test(phone); 
  };

  const isValidPassword = function (pass) {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(pass);
  };

  module.exports = {isValidEmail,isValidName,isValidPassword,isValidPhone,isValidRequest}