
function validateform() {
    var nam = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    var cnfpass = document.getElementById("confirmPassword").value;
    
    if (nam === "" || email === "" || pass === "" || cnfpass === "") {
        alert("All the fields are mandatory!");
        return false;
    } else if (pass.length < 6) {
        alert("Password length should be at least 6 characters!");
        return false;
    } else if (pass !== cnfpass) {
        alert("Passwords should match");
        return false;
    }
    else{
        alert("Account created sucessfully!")
    return true;
    }
}
function validate() {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;            
    if (email === "" ) {
        alert("Please enter email..!");
        return false;
    } else if ( pass === "") {
        alert("please enter password!");
        return false;
    }else if (pass.length < 6) {
        alert("Password length should be at least 6 characters!");
        return false;
    } 
    else{
        alert("You are signed in!")
    return true;
    }
}


