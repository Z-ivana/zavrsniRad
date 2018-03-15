'use strict'
//######################  metodi vezani za localStorage
let lStorage = (function () {
        let loadFromLocalStorage = function (nameOfObject) {
        var obj=localStorage.getItem(nameOfObject);
        if(obj==null)obj="{}";
        return JSON.parse(obj);  // ovde mi izbacije gresku ne znam zasto
    }
    let saveToLocalStorage = function (nameOfObject, object) {
        localStorage.setItem(nameOfObject, JSON.stringify(object));
    }
    return {
        load: loadFromLocalStorage,
        save: saveToLocalStorage
    }
})();
//####################### metodi vezani za cooki ne rade treba da se preprave
let cStorage = function () {
    let saveToCookiesStorage = function (cookieName, objectToSave, exHours) { // ovo ne radi ne znam zasto
        let d = new Date();
        d.setTime((d.getTime() + exHours * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + objectToSave + ";" + expires + ";path=/";
        console.log("asdasdasdasdas");
    }
    let delFromCookiesStorages = function (cookieName) {
        document.cookie = cookieName + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    return  {
        save:saveToCookiesStorage(),
        del:delFromCookiesStorages()
    }
}
//######################## metodi vezani za log in i registraciju
let logRegForget = function () {
    let log=lStorage.load('ulogovanKorisnik');
    let isLogedIn = function () {
        if (typeof lStorage.load('ulogovanKorisnik').name=='undefined') {
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
    let allUsers = lStorage.load("allUsers");
    if (allUsers == null) allUsers = {};
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
        lStorage.save("allUsers", allUsers);
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

        if (typeof allUsers[email]!='undefined' && validateUser(email, password) == true) {
            let whoIsLoged = allUsers[email].name + " " + allUsers[email].lastName;
            console.log("welcome ", whoIsLoged);
            lStorage.save("ulogovanKorisnik", allUsers[email]);
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
};

logRegForget();
// ########################## kreiranje novih knjiga i autora
let booksAndAutors = (function () {
    console.log('booksAndAutors');
    let allBooks = lStorage.load("allBooks");
    if (allBooks == null) allBooks = {};

    let allActor = lStorage.load("allAuthor");
    if (allActor == null) allAuthor = {};

    const Book = function () {
        let id = document.getElementById("bookId").value;
        let name = document.getElementById("bookName").value;
        let author = document.getElementById("author").value;   //select lista i ako nema kreiraj novog
        let publicationYear = document.getElementById("Year").value;
        let gender = document.querySelector('input[name="gender"]:checked').value;// zanrovi su niz treba da ide u ls isto
        let borrowed = document.getElementById("borrowed").value;
        let read = document.getElementById("read").value;
        let rate = document.getElementById("rate").value;
        let book = new Book(id, name, author, publicationYear, gender, borrowed, read, rate);
        return book;
    }

    const Autor = function () {
        let name = document.getElementById("authorName").value;
        let lastName = document.getElementById("authorLastName").value;
        let born = document.getElementById("born").value;
        let died = document.getElementById("died").value;
        let nationality = document.querySelector('input[name="gender"]:checked').value;// niz koji se cuva u ls
        let autor = new Autor(name, lastName, born, died, nationality);
        return autor;
    }
}());
//########################## sortiranje

//############################# pretraga
