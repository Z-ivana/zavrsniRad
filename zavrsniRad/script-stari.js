'use strict'

let logRegForget = function () {
    let loadFromLocalStorage = function (nameOfObject) {
        return JSON.parse(localStorage.getItem(nameOfObject));
    }
    let saveToLocalStorage = function (nameOfObject, object) {
        localStorage.setItem(nameOfObject, JSON.stringify(object));
    }
    let log = (function () {
        if (!loadFromLocalStorage("ulogovanKorisnik")) return false;
        return true;
    })();
    let isLogedIn = function () {
        if (log == false) {
            document.getElementById("logIn").style.display = "block";
            document.getElementById("logOut").style.display = "none";
        }
        else {
            document.getElementById("logIn").style.display = "none";
            document.getElementById("logOut").style.display = "block";
        }
    };
    document.body.addEventListener("load", isLogedIn());

    const User = function (name, lastName, email, gender, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.password = password;
    }
    document.getElementById("registerButton").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("register").style.display = "block";
    });
    document.getElementById("forgetPassButton").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("forgetPassword").style.display = "block";
    });
    let allUsers = loadFromLocalStorage("allUsers");
    if (allUsers == null) allUsers = {};
    /*  let saveToCookiesStorage = function (cookieName, objectToSave, exHours) { // ovo ne radi ne znam zasto
            let d = new Date();
            d.setTime((d.getTime() + exHours * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cookieName + "=" + objectToSave + ";" + expires + ";path=/";
            console.log("asdasdasdasdas");
        }
        let delFromCookiesStorages = function (cookieName) {
            document.cookie = cookieName + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        } */
    let createUser = function () {
        let name = document.getElementById("userName").value;
        let lastName = document.getElementById("userLastname").value;
        let email = document.getElementById("userEmail").value;
        let gender = document.querySelector('input[name="gender"]:checked').value;
        let password = document.getElementById("userPassword").value;
        let user = new User(name, lastName, email, gender, password);
        return user;
    }
    let addUserToAllUsers = function (email) {
        if (!allUsers[email]) {
            allUsers[email] = createUser();
            return allUsers;
        }
        else console.log("this email already exist!");
    }
    document.getElementById("createAcount").addEventListener("click", function () {
        createUser();
        addUserToAllUsers(document.getElementById("userEmail").value);
        saveToLocalStorage("allUsers", allUsers)
        document.getElementById("register").style.display = "none";
        document.getElementById("logIn").style.display = "block";
    });
    let validateUser = function (email, password) {
        if (allUsers[email].password == password) return true;
        return false;
    }
    document.getElementById("logInButton").addEventListener("click", function (e) {
        e.preventDefault();
        let email = document.getElementById("email").value;
        let password = document.getElementById("pass").value;

        if (validateUser(email, password) == true) {
            let whoIsLoged = allUsers[email].name + " " + allUsers[email].lastName;
            console.log("welcome ", whoIsLoged);
            saveToLocalStorage("ulogovanKorisnik", allUsers[email]);
            //saveToCookiesStorage(email, whoIsLoged, 3);
            log = true;
            document.getElementById("logOut").style.display = "block";
            document.getElementById("logIn").style.display = "none";
        }
        else console.log("neispravan mejl ili password");

        console.log("da li je logovan: " + log);
    });
    document.getElementById("logOut").addEventListener("click", function () {
        //let cookieName = document.getElementById("email").value;
        log = false;
        console.log("da li je sad ulogovan::: " + log);
        localStorage.removeItem("ulogovanKorisnik");
        //delFromCookiesStorages(cookieName);
        document.getElementById("logOut").style.display = "none";
        document.getElementById("logIn").style.display = "block";
    });
    document.getElementById("forgetPassButton").addEventListener("click", function () {
        document.getElementById("forgetPassword").style.display = "block";
    });
    document.getElementById("sendEmail").addEventListener("click", function () {
        let email = document.getElementById("forgetPass").value;
        let password = allUsers[email].password;
        console.log(password);

    });
}();

