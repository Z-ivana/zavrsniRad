'use strict';
//######################  metodi vezani za localStorage
var lStorage = (function () {
    var loadFromLocalStorage = function (nameOfObject) {
        var object = localStorage.getItem(nameOfObject);
        if (object == null) object = "{}";
        return JSON.parse(object);
    };
    var saveToLocalStorage = function (nameOfObject, object) {
        localStorage.setItem(nameOfObject, JSON.stringify(object));
    };
    var delFromLocalStorages = function (nameOfObject, object) {
        delete nameOfObject[object];
    };
    return {
        delete: delFromLocalStorages,
        load: loadFromLocalStorage,
        save: saveToLocalStorage
    }
})();
var allBooks = lStorage.load("allBooks");
var allAuthors = lStorage.load("allAuthors");
var getValue = function (id) {
    return document.getElementById(id).value;
};
var setValue = function (id, newValue) {
    document.getElementById(id).value = newValue;
};
var show = function (id) {
    if(! document.getElementById(id)){
        console.log('nema id-ja ',id);
        return;
    }
    document.getElementById(id).style.display = "block";
};
var hide = function (id) {
    if(! document.getElementById(id)){
        console.log('nema id-ja ',id);
        return;
    }
    document.getElementById(id).style.display = "none";
};
//######################## metodi vezani za log in i registraciju
var logRegForget = function () {
    var log = lStorage.load('loggedInUser');
    var isLogedIn = function () {
        if (typeof log.name == "undefined") {
            show("logIn");
            hide("logOut");
        }
        else {
            hide("logIn");
            show("logOut");
        }
    };
    document.body.addEventListener("load", isLogedIn);

    var User = function (name, lastName, email, gender, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.password = password;
    };
    var showOnlyRegistrationForm = function () {
        show("register");
        hide("logIn");
    };

    var allUsers = lStorage.load("allUsers");
    if (allUsers == null) allUsers = {};
    var createUser = function () {
        var name = getValue("userName");
        var lastName = getValue("userLastname");
        var email = getValue("userEmail");
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var password = getValue("userPassword");
        return new User(name, lastName, email, gender, password);
    };
    var addUserToAllUsers = function (email) {
        if (!allUsers[email]) {
            allUsers[email] = createUser();
            return allUsers;
        }
        else console.log("this email already exist!");
    };
    var createNewAcount = function () {
        createUser();
        addUserToAllUsers(getValue("userEmail"));
        lStorage.save("allUsers", allUsers);
        hide("register");
        show("logIn");
    };
    var validateUser = function (email, password) {
        if (allUsers[email].password == password) return true;
        return false;
    };

    var welcomeText = document.getElementById("welcome");
    var whoIsLoged;
    console.log("log...........", log);

    var welcomeMesage = function () {
        if (typeof log.name != "undefined") {
            whoIsLoged = log.name + " " + log.lastName;
            console.log("ko je ulogovan........", whoIsLoged);
            welcomeText.innerText = "Welcome, " + whoIsLoged + " !";
        } else {
            welcomeText.innerText = "Welcome, stranger please log in !";
        }
    };
    console.log("log.name......", log.name);
    welcomeMesage();

    var logInFunction = function (e) {
        e.preventDefault();
        var email = getValue("email");
        var password = getValue("pass");
        location.reload();
        // welcomeMesage();             

        if (typeof allUsers[email] != 'undefined' && validateUser(email, password) == true) {
            lStorage.save("loggedInUser", allUsers[email]);
            show("logOut");
            hide("logIn");
            //hide("welcome");
        } else {
            console.log("neispravan mejl ili password");
        }
    };
    var logOutFunction = function () {
        location.reload();
        welcomeMesage();
        console.log("da li je sad ulogovan::: " + log);
        localStorage.removeItem("loggedInUser");
        hide("logOut");
        show("logIn");
    };
    var showForgetPass = function () {
        show("forgetPassword");
        hide("logIn");
    };
    var showForgottenPass = function () {
        var email = getValue("forgetPass");
        var password = allUsers[email].password;
        console.log(password);
    };
    document.body.addEventListener("load", isLogedIn);
    document.getElementById("registerButton").addEventListener("click", showOnlyRegistrationForm);
    document.getElementById("createAcount").addEventListener("click", createNewAcount);
    document.getElementById("logInButton").addEventListener("click", function (event){
        logInFunction(event)
    });
    document.getElementById("logOut").addEventListener("click", logOutFunction);
    document.getElementById("forgetPassButton").addEventListener("click", showForgetPass);
    document.getElementById("sendEmail").addEventListener("click", showForgottenPass);

    return {
        log: log
    }
};

//logRegForget();
//######################### kreiranje liste sa zanrovima
var createGenderList = (function () {
    var genderList = ["Pick gender from list", "Art & Photography", "Biography", "Children's Books", "Crafts & Hobbies", "Crime & Thriller", "Fiction", "Food & Drink", "Graphic Novels", "Anime & Manga", "History & Archaeology", "Mind, Body & Spirit", "Science Fiction, Fantasy & Horror", "Business, Finance & Law", "Computing", "Dictionaries & Languages", "Entertainment", "Health", "Home & Garden", "Humour", "Medical", "Natural History", "Personal Development", "Poetry & Drama", "Reference", "Religion", "Romance", "Science & Geography", "Society & Social Sciences", "Sport", "Stationery", "Teaching Resources & Education", "Technology & Engineering", "Transport", "Travel & Holiday Guides"];
    for (var i = 0; i < genderList.length; i++) {
        var option = document.createElement("option");
        if (genderList[i] == "Pick gender from list") {
            option.setAttribute("value", "");
        }
        option.setAttribute("value", genderList[i]);
        option.textContent = genderList[i];
        document.getElementById("gender").appendChild(option);
    }
})();
// ########################## kreiranje novih knjiga i authora
var booksAndAuthors = function () {

    var allBooks = lStorage.load("allBooks");
    if (allBooks == null) allBooks = {};

    var allAuthors = lStorage.load("allAuthors");
    if (allAuthors == null) allAuthors = {};

    var addNationalitiesToSelectList = (function () {
        var allNationalities = ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'CapeVerdean', 'CentralAfrican', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'CostaRican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dutch', 'EastTimorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'EquatorialGuinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'KittianandNevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'NewZealander', 'Nicaraguan', 'Nigerian', 'Nigerien', 'NorthKorean', 'NorthernIrish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'PapuaNewGuinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'SaintLucian', 'Salvadoran', 'Samoan', 'SanMarinese', 'SaoTomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'SierraLeonean', 'Singaporean', 'Slovakian', 'Slovenian', 'SolomonIslander', 'Somali', 'SouthAfrican', 'SouthKorean', 'Spanish', 'SriLankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian/Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'];
        for (var i = 0; i < allNationalities.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", allNationalities[i]);
            option.textContent = allNationalities[i];
            document.getElementById("nationality").appendChild(option);
        }
    }());
    var showOnlyAddAuthor = function () {
        show("addAuthor");
        hide("search");
        hide("profilePage");
        hide("addBook");
        hide("myTableBook");
        hide("myTableAuthor");
        document.getElementById("saveChangesA").style.visibility = "hidden";
    };
    var Author = function (id, name, lastName, born, died, nationality) {
        this.name = name;
        this.lastName = lastName;
        this.born = born;
        this.died = died;
        this.nationality = nationality;
    };
    var createAuthor = function () {
        var name = getValue("authorName");
        var lastName = getValue("authorLastName");
        var born = getValue("born");
        var died = getValue("died");
        var nationality = getValue("nationality");
        var id = name + lastName + born;
        return new Author(id, name, lastName, born, died, nationality);
    };
    var addAuthorToAllAuthors = function name(id) {
        if (!allAuthors[id] && document.querySelectorAll("require")) {
            allAuthors[id] = createAuthor();
            return allAuthors;
        }
        else console.log("this author already exist!");
    };
    var createAuthorsList = function () {
        var arreyId = [];
        for (var key in allAuthors) {
            arreyId.push(key);
        }
        for (var i = 0; i < arreyId.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", allAuthors[arreyId[i]].name + " " + allAuthors[arreyId[i]].lastName);
            option.textContent = allAuthors[arreyId[i]].name + " " + allAuthors[arreyId[i]].lastName;
            document.getElementById("author").appendChild(option);
        }
    };
    var showOnlyAddBook = function name() {
        show("addBook");
        document.getElementById("saveChanges").style.visibility = "hidden";
        hide("tableBookList");
        hide("tableAuthorList");
        hide("profilePage");
        hide("addAuthor");
        hide("search");
        document.getElementById("author").addEventListener("click", createAuthorsList);
    };
    var saveNewAuthorFunction = function (e) {
        e.preventDefault(e);
        createAuthor();
        var authorsId = getValue("authorName") + getValue("authorLastName") + getValue("born");
        addAuthorToAllAuthors(authorsId);
        lStorage.save("allAuthors", allAuthors);
        document.getElementById("addAuthor").reset();
    };
    var stars = document.querySelectorAll(".star");
    var starNo;
    for (var i = 0; i < stars.length; i++) {
        stars[i].addEventListener("click", function () {
            starNo = this.className.charAt(5);
            for (var j = 0; j < starNo; j++) {
                stars[j].src = "pictures/rating/yelowStar.png";
            }
        });
    }

    var Book = function (isbn, name, author, publicationYear, gender, borrowed, whom, read, rate) {
        this.isbn = isbn;
        this.name = name;
        this.author = author;
        this.publicationYear = publicationYear;
        this.gender = gender;
        this.borrowed = borrowed;
        this.whom = whom;
        this.read = read;
        this.rate = rate;
    };

    var createBook = function () {
        var isbn = getValue("bookIsbn");
        var name = getValue("bookName");
        var author = getValue("author");
        var publicationYear = getValue("year");
        var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
        var borrowed = document.getElementById("borrowed").checked;
        var whom = getValue("whom");
        var read = document.getElementById("read").checked;
        return new Book(isbn, name, author, publicationYear, gender, borrowed, whom, read, starNo);
    };
    var addBookToAllBooks = function (isbn) {
        if (!allBooks[isbn] && document.querySelectorAll("require") != null) {
            allBooks[isbn] = createBook();
            return allBooks;
        }
        else console.log("this book already exist!");
    };
    var saveBookFunction = function (e) {
        e.preventDefault();
        createBook();
        addBookToAllBooks(getValue("bookIsbn"));
        lStorage.save("allBooks", allBooks);
        document.getElementById("addBook").reset();
    };
    var hideSaveChangesButton = function () {
        show("addAuthor");
        // document.getElementById("saveChangesA").style.visibility = "hidden";
    };
    document.getElementById("addAuthorButton").addEventListener("click", hideSaveChangesButton);
    document.getElementById("read").addEventListener("click", function (){
        show("yesRead")
    });
    document.getElementById("notRead").addEventListener("click", function (){
        hide("yesRead")
    });
    document.getElementById("borrowed").addEventListener("click", function (){
        show("whomBorrowed")
    });
    document.getElementById("notBorrowed").addEventListener("click", function (){
        hide("whomBorrowed")
    });
    document.getElementById("saveBook").addEventListener("click", saveBookFunction);
    document.getElementById("addNewAuthor").addEventListener("click", showOnlyAddAuthor);
    document.getElementById("addNewBook").addEventListener("click", showOnlyAddBook);
    document.getElementById("saveNewAuthor").addEventListener("click", saveNewAuthorFunction);
    document.getElementById("author").addEventListener("click", createAuthorsList);
    return {
        createAuthor: createAuthor,
        createBook: createBook,
        addBookToAllBooks: addBookToAllBooks
    }
};
var booksAndAuthorsManipulations=booksAndAuthors();
//##########################   Tabela sa knjigama
var bookTable = function () {
    var createTableHead = function (numberOfColumn, id, clasa) {
        var table = document.createElement("table");
        table.setAttribute("border-collapse", "collapse");
        table.setAttribute("id", "myTableBook");
        table.setAttribute("class", clasa);
        document.getElementById("tableBookList").appendChild(table);
        var tableHead = document.createElement("thead");
        tableHead.setAttribute("id", "bookTableHead");
        table.appendChild(tableHead);
        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", id);
        var headRow = document.createElement("tr");
        headRow.setAttribute("id", "bookHeadRow");
        tableHead.appendChild(headRow);
        for (var i = 0; i < numberOfColumn; i++) {
            var column = document.createElement("th");
            headRow.appendChild(column);
        }
        table.appendChild(tbody);
        return table;
    };
    var writeTableHead = function (numberOfColumn, arreyWidthNames) {
        var nameOfColumn = document.getElementById("bookHeadRow").childNodes;
        for (var i = 0; i < numberOfColumn; i++) {
            nameOfColumn[i].textContent = arreyWidthNames[i];
        }
        nameOfColumn[numberOfColumn - 1].colSpan = "2";
    };
    var writeTableData = function () {

        for (var bookIsbn in allBooks) {
            var newRow = document.createElement("tr");
            document.getElementById("booksTable").appendChild(newRow);
            for (var i = 0; i < 10; i++) {
                var newColumn = document.createElement("td");
                newRow.appendChild(newColumn);
            }
            newRow.childNodes[0].textContent = bookIsbn;
            newRow.childNodes[1].textContent = allBooks[bookIsbn].name;
            newRow.childNodes[2].textContent = allBooks[bookIsbn].author;
            newRow.childNodes[3].textContent = allBooks[bookIsbn].publicationYear;
            newRow.childNodes[4].textContent = allBooks[bookIsbn].gender;
            if (allBooks[bookIsbn].borrowed == true) {
                newRow.childNodes[5].textContent = "yes";
                newRow.childNodes[5].setAttribute("title", "book is borowed to " + allBooks[bookIsbn].whom);
            } else {
                newRow.childNodes[5].textContent = "no";
            }
            newRow.childNodes[6].textContent = allBooks[bookIsbn].read === true ? "yes" : "no";
            newRow.childNodes[7].textContent = allBooks[bookIsbn].read === true ? allBooks[bookIsbn].rate + "/5" : "";


            var del = document.createElement("div");
            del.setAttribute("id", bookIsbn + "_del");
            del.textContent = "del";
            newRow.childNodes[8].appendChild(del);
            var edit = document.createElement("div");
            edit.setAttribute("id", bookIsbn + "_edit");
            edit.textContent = "edit";
            newRow.childNodes[9].appendChild(edit);
        }
    };

    createTableHead(9, "booksTable", "tableSorter");
    writeTableHead(9, ["ISBN", "Book name", "Author", "Publication year", "Gender", "Borrowed", "Read", "Rateing", "EditOrDel"]);
    writeTableData();

};
bookTable();

var showOnlyBookList = function () {
    show("myTableBook");
    show("tableBookList");
    hide("myTableAuthor");
    hide("addBook");
    hide("addAuthor");
    hide("search");
    hide("profilePage");
};
document.getElementById("bookList").addEventListener("click", showOnlyBookList);

var authorTable = (function () {
    var createTableHead = function (numberOfColumn, id, clasa) {
        var table = document.createElement("table");
        table.setAttribute("border-collapse", "collapse");
        table.setAttribute("id", "myTableAuthor");
        table.setAttribute("class", clasa);
        document.getElementById("tableAuthorList").appendChild(table);
        var tableHead = document.createElement("thead");
        tableHead.setAttribute("id", "authorTableHead");
        table.appendChild(tableHead);
        var tbody = document.createElement("tbody");
        tbody.setAttribute("id", id);
        var headRow = document.createElement("tr");
        headRow.setAttribute("id", "authorHeadRow");
        tableHead.appendChild(headRow);
        for (var i = 0; i < numberOfColumn; i++) {
            var column = document.createElement("th");
            headRow.appendChild(column);
        }
        table.appendChild(tbody);
        return table;
    };
    var writeTableHead = function (numberOfColumn, arreyWidthNames) {
        var nameOfColumn = document.getElementById("authorHeadRow").childNodes;
        for (var i = 0; i < numberOfColumn; i++) {
            nameOfColumn[i].textContent = arreyWidthNames[i];
        }
        nameOfColumn[numberOfColumn - 1].colSpan = "2";
    };

    var writeTableData = function () {

        for (var authorsId in allAuthors) {
            var newRow = document.createElement("tr");
            document.getElementById("authorsTable").appendChild(newRow);
            for (var i = 0; i < 7; i++) {
                var newColumn = document.createElement("td");
                newRow.appendChild(newColumn);
            }
            newRow.childNodes[0].textContent = allAuthors[authorsId].name;
            newRow.childNodes[1].textContent = allAuthors[authorsId].lastName;
            newRow.childNodes[2].textContent = allAuthors[authorsId].born;
            newRow.childNodes[3].textContent = allAuthors[authorsId].died;
            newRow.childNodes[4].textContent = allAuthors[authorsId].nationality;
            var del = document.createElement("div");
            del.setAttribute("id", authorsId + "-del");
            del.textContent = "del";
            newRow.childNodes[5].appendChild(del);
            var edit = document.createElement("div");
            edit.setAttribute("id", authorsId + "-edit");
            edit.textContent = "edit";
            newRow.childNodes[6].appendChild(edit);
        }
    };
    var showOnlyAuthorList = function () {
        show("myTableAuthor");
        show("tableAuthorList");
        hide("myTableBook");
        hide("search");
        hide("addBook");
        hide("addAuthor");
        hide("profilePage");
    };
    document.getElementById("authorList").addEventListener("click", showOnlyAuthorList);
    return {
        createHead: createTableHead,
        writeHead: writeTableHead,
        writeData: writeTableData
    }
})();
authorTable.createHead(6, "authorsTable", "tableSorter");
authorTable.writeHead(6, ["Name", "Last Name", "Birth year", "Died year", "Nationality", "EditOrDel"])
authorTable.writeData();
//########################## sortiranje pomocu Jqueri-ja
var sortTable = function (id) {
    $(document).ready(function () {
        $("#" + id).tablesorter();
    });

    $(document).ready(function () {
        $("#" + id).tablesorter({sortList: [[0, 0], [1, 0]]});
    });
};
sortTable("myTableBook");
sortTable("myTableAuthor");
//############################ Profil korisnika
var createProfilePage = function () {

    var loggedInUser = lStorage.load("loggedInUser");
    document.getElementById("myName").textContent = loggedInUser.name;
    document.getElementById("myLastName").textContent = loggedInUser.lastName;
    document.getElementById("myGender").textContent = loggedInUser.gender;
    document.getElementById("myEmail").textContent = loggedInUser.email;
    show("profilePage");
    hide("tableBookList");
    hide("tableAuthorList");
    hide("search");
    hide("addBook");
    hide("addAuthor");
};
document.getElementById("profile").addEventListener("click", createProfilePage);
//############################ edit & del
var editAndDel = function () {
    var allEditB = document.querySelectorAll("[id$='_edit']");
    var saveChanges = document.createElement("button");
    saveChanges.setAttribute("type", "submit");
    saveChanges.setAttribute("id", "saveChanges");
    saveChanges.textContent = "Save Changes";
    document.getElementById("buttons").appendChild(saveChanges);

    var saveChagesB = function () {
        if (allBooks[isbn].isbn == getValue("bookIsbn") && document.querySelectorAll("require") != null) {
            allBooks[isbn] = booksAndAuthorsManipulations.createBook();
        }
        else {
            console.log("you can`t change isbn number of a book and you need to fill all requered filds");
        }
        lStorage.save("allBooks", allBooks);
    };
    var editBook = function (e) {
        e.preventDefault();
        var isbn = this.id.substr(0, this.id.length - 5);
        show("addBook");
        document.getElementById("saveChanges").style.visibility = "visible";
        setValue("bookIsbn", allBooks[isbn].isbn);
        setValue("bookName", allBooks[isbn].name);
        setValue("author", allBooks[isbn].author);
        setValue("gender", allBooks[isbn].gender);
        setValue("year", allBooks[isbn].publicationYear);
        setValue("borrowed", allBooks[isbn].borrowed);
        setValue("whom", allBooks[isbn].whom);
        setValue("read", allBooks[isbn].read);
        setValue("rate", allBooks[isbn].rate);
        document.getElementById("saveChanges").addEventListener("click", saveChangesB);
    };
    for (var i = 0; i < allEditB.length; i++) {
        allEditB[i].addEventListener("click", editBook);
    }
    var allEditA = document.querySelectorAll("[id$='-edit']");
    var saveChangesA = document.createElement("button");

    saveChangesA.setAttribute("type", "submit");
    saveChangesA.setAttribute("id", "saveChangesA");
    saveChangesA.textContent = "Save Changes";
    document.getElementById("buttonsA").appendChild(saveChangesA);
    var saveChangesToAuthor = function () {
        if (document.querySelectorAll("require") != null) {
            allAuthors[authorsId] = booksAndAuthorsManipulations.createAuthor();
        }
        lStorage.save("allAuthors", allAuthors);
    };
    var editAuthorFunction = function (e) {
        e.preventDefault();
        var authorsId = e.target.id.substr(0, e.target.id.length - 5);
        show("addAuthor");
        document.getElementById("saveChangesA").style.visibility = "visible";
        setValue("authorName", allAuthors[authorsId].name);
        setValue("authorLastName", allAuthors[authorsId].lastName);
        setValue("born", allAuthors[authorsId].born);
        setValue("died", allAuthors[authorsId].died);
        setValue("nationality", allAuthors[authorsId].nationality);
        document.getElementById("saveChangesA").addEventListener("click", saveChangesToAuthor);
    };
    for (var i = 0; i < allEditA.length; i++) {
        allEditA[i].addEventListener("click", editAuthorFunction);
    }

    var deleteBooksOrAuthor = function (bookOrAuthor) {
        var allDell;
        var deleteBook = function (e) {
            var isbn = e.target.id.substr(0, e.target.id.length - 4);
            delete allBooks[isbn];
            lStorage.save("allBooks", allBooks);
            location.reload();
            show("myTableBook");// ne rade
            show("tableBookList");
        };
        var deleteAuthor = function (e) {
            var authorsId = e.target.id.substr(0, e.target.id.length - 4);
            delete allAuthors[authorsId];
            lStorage.save("allAuthors", allAuthors);
            location.reload();
            show("myTableAuthor");// ne rade
            show("tableAuthorList");
        };
        if (bookOrAuthor == "book") {
            allDell = document.querySelectorAll("[id$='_del']");
            for (var i = 0; i < allDell.length; i++) {
                allDell[i].addEventListener("click", deleteBook);
            }
        } else if (bookOrAuthor == "author") {
            allDell = document.querySelectorAll("[id$='-del']");
            for (var i = 0; i < allDell.length; i++) {
                allDell[i].addEventListener("click", deleteAuthor);
            }
        }
    };
    deleteBooksOrAuthor("book");
    deleteBooksOrAuthor("author");

};
editAndDel();
//############################# pretraga
var search = function () {
    var find = false;
    var span = document.createElement("span");
    span.textContent = "";
    document.body.appendChild(span);
    var searchText = getValue("searchName");
    for (var isbn in allBooks) {
        var string = allBooks[isbn].name + allBooks[isbn].author;
        if (string.indexOf(searchText) != -1) {
            span.textContent += allBooks[isbn].name;
            console.log("name ", allBooks[isbn].name);
            console.log("search text ", searchText);
            console.log(string.indexOf(searchText));
            find = true;
        }
    }
    if (find == false) span.textContent = "Nema trazene knjige";
};
document.getElementById("searchButton").addEventListener("click", search);
var showSearchBox = function () {
    show("search");
    show("myTableBook");
    show("tableBookList");
    hide("tableAuthorList");
    hide("addBook");
    hide("addAuthor");
    hide("profilePage");

};
document.getElementById("searchMenuButton").addEventListener("click", showSearchBox);
