
function validateform(event) {
    event.preventDefault();
    
    var name = document.getElementById("signup-name").value;
    var email = document.getElementById("signup-email").value;
    var password = document.getElementById("signup-password").value;
    var cnfpass = document.getElementById("signup-confirmPassword").value;
    
    var data = {
        username: name,
        email: email,
        password: password
    }

    data = JSON.stringify(data);
    
    if (name === "" || email === "" || password === "" || cnfpass === "") {
        alert("All the fields are mandatory!");
        return false;
    } else if (password.length < 6) {
        alert("Password length should be at least 6 characters!");
        return false;
    } else if (password !== cnfpass) {
        alert("Passwords should match");
        return false;
    }
    else{
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            alert("Account created successfully!");
            console.log(data);
            window.location.href = "Signin.html";
        })
        .catch(err => {
            console.error('There was a problem with the fetch operation:', err);
            alert("There was a problem creating your account. Please try again later.");
        });
    }
}

function validate() {
    var email = document.getElementById("signin-email").value;
    var password = document.getElementById("signin-password").value;
    var data = JSON.stringify({
        email: email,
        password: password
    });

    if (email === "") {
        alert("Please enter email..!");
        return false;
    } else if (password === "") {
        alert("please enter password!");
        return false;
    } else if (password.length < 6) {
        alert("Password length should be at least 6 characters!");
        return false;
    } else {
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'main.html';
                alert("Sign-in successful!");
                return true;
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert("Sign-in successful!!");
            return false;
        });
    }
}





