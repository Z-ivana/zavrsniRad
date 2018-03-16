'use strict'
//######################  metodi vezani za localStorage
var lStorage = (function () {
    var loadFromLocalStorage = function (nameOfObject) {
        var object = localStorage.getItem(nameOfObject);
        if (object == null)object="{}";
        return JSON.parse(object);  
    }
    var saveToLocalStorage = function (nameOfObject, object) {
        localStorage.setItem(nameOfObject, JSON.stringify(object));
    }
    var delFromLocalStorages=function (nameOfObject,object) {
        delete nameOfObject[object];
    }
    return {
        delete  : delFromLocalStorages,
        load    : loadFromLocalStorage,
        save    : saveToLocalStorage
    }
})();
var allBooks=lStorage.load("allBooks"); 
var allAuthors = lStorage.load("allAuthors");        
//######################## metodi vezani za log in i registraciju
var logRegForget = function () {
    var log=lStorage.load('loggedInUser');   
    var isLogedIn = function () {
        if (typeof log.name=="undefined") {
            document.getElementById("logIn").style.display = "block";
            document.getElementById("logOut").style.display = "none";
        }   
        else {
            document.getElementById("logIn").style.display = "none";
            document.getElementById("logOut").style.display = "block";
        }
    };
    document.body.addEventListener("load", isLogedIn());

    var User = function (name, lastName, email, gender, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.password = password;
    }
    document.getElementById("registerButton").addEventListener("click", function () {
        document.getElementById("register").style.display = "block";
        document.getElementById("logIn").style.display="none";
    });
    document.getElementById("forgetPassButton").addEventListener("click", function () {
        document.getElementById("forgetPassword").style.display = "block";
    });
    var allUsers = lStorage.load("allUsers");
    if (allUsers == null) allUsers = {};
    var createUser = function () {
        var name = document.getElementById("userName").value;
        var lastName = document.getElementById("userLastname").value;
        var email = document.getElementById("userEmail").value;
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var password = document.getElementById("userPassword").value;
        var user = new User(name, lastName, email, gender, password);
        return user;
    }
    var addUserToAllUsers = function (email) {
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
    var validateUser = function (email, password) {
        if (allUsers[email].password == password) return true;
        return false;
    }

        var welcomeText=document.getElementById("welcome");
        var whoIsLoged;
        console.log("log...........",log);
        
        var welcomeMesage=function () {
            if(typeof log.name!="undefined"){
                whoIsLoged = log.name + " " + log.lastName;  
                console.log("ko je ulogovan........",whoIsLoged);
                welcomeText.innerText="Welcome, "+whoIsLoged+" !";
            }else {
                welcomeText.innerText="Welcome, stranger please log in !";   
            }  
        }
        console.log("log.name......", log.name);
        welcomeMesage();    
        
        document.getElementById("logInButton").addEventListener("click", function (e) {
            e.preventDefault(); 
            var email = document.getElementById("email").value;
            var password = document.getElementById("pass").value;
            location.reload()
           // welcomeMesage();             
            
        if (typeof allUsers[email]!='undefined' && validateUser(email, password) == true) {
            lStorage.save("loggedInUser", allUsers[email]);
            document.getElementById("logOut").style.display = "block";
            document.getElementById("logIn").style.display = "none";
            //document.getElementById("welcome").style.display="none";
        }else {
            console.log("neispravan mejl ili password");
        }
        
    });
    document.getElementById("logOut").addEventListener("click", function () {
        location.reload();
        welcomeMesage();
        console.log("da li je sad ulogovan::: " + log);
        localStorage.removeItem("loggedInUser");
        document.getElementById("logOut").style.display = "none";
        document.getElementById("logIn").style.display = "block";
    });
    document.getElementById("forgetPassButton").addEventListener("click", function () {
        document.getElementById("forgetPassword").style.display = "block";
        document.getElementById("logIn").style.display = "none";
    });
    document.getElementById("sendEmail").addEventListener("click", function () {
        var email = document.getElementById("forgetPass").value;
        var password = allUsers[email].password;
        console.log(password);

    });
    return{
        log:log,
        createUser:createUser,
        addUserToAllUsers:addUserToAllUsers
        
    }
};
logRegForget();




//######################### kreiranje liste sa zanrovima
var createGenderList=(function () {
    var genderList=["Pick gender from list","Art & Photography","Biography","Children's Books","Crafts & Hobbies","Crime & Thriller","Fiction","Food & Drink","Graphic Novels", "Anime & Manga","History & Archaeology", "Mind, Body & Spirit", "Science Fiction, Fantasy & Horror", "Business, Finance & Law","Computing","Dictionaries & Languages","Entertainment","Health","Home & Garden","Humour","Medical","Natural History","Personal Development","Poetry & Drama","Reference","Religion","Romance","Science & Geography","Society & Social Sciences","Sport","Stationery","Teaching Resources & Education","Technology & Engineering","Transport","Travel & Holiday Guides"];   
    for (var i = 0; i < genderList.length; i++) {
       var option=document.createElement("option");
       if(genderList[i]=="Pick gender from list"){
            option.setAttribute("value","");
       }
        option.setAttribute("value",genderList[i]);
        option.textContent=genderList[i];
        document.getElementById("gender").appendChild(option);
    }
})();
// ########################## kreiranje novih knjiga i authora
var booksAndAuthors = (function () {

    var allBooks = lStorage.load("allBooks");
    if (allBooks == null) allBooks = {};

    var allAuthors = lStorage.load("allAuthors");
    if (allAuthors == null) allAuthors = {};

    var addNationalitiesToSelectList= (function () {
        var allNationalities=['Afghan','Albanian','Algerian','American','Andorran','Angolan','Antiguans','Argentinean','Armenian','Australian','Austrian','Azerbaijani','Bahamian','Bahraini','Bangladeshi','Barbadian','Barbudans','Batswana','Belarusian','Belgian','Belizean','Beninese','Bhutanese','Bolivian','Bosnian','Brazilian','British','Bruneian','Bulgarian','Burkinabe','Burmese','Burundian','Cambodian','Cameroonian','Canadian','CapeVerdean','CentralAfrican','Chadian','Chilean','Chinese','Colombian','Comoran','Congolese','CostaRican','Croatian','Cuban','Cypriot','Czech','Danish','Djibouti','Dominican','Dutch','EastTimorese','Ecuadorean','Egyptian','Emirian','EquatorialGuinean','Eritrean','Estonian','Ethiopian','Fijian','Filipino','Finnish','French','Gabonese','Gambian','Georgian','German','Ghanaian','Greek','Grenadian','Guatemalan','Guinea-Bissauan','Guinean','Guyanese','Haitian','Herzegovinian','Honduran','Hungarian','I-Kiribati','Icelander','Indian','Indonesian','Iranian','Iraqi','Irish','Israeli','Italian','Ivorian','Jamaican','Japanese','Jordanian','Kazakhstani','Kenyan','KittianandNevisian','Kuwaiti','Kyrgyz','Laotian','Latvian','Lebanese','Liberian','Libyan','Liechtensteiner','Lithuanian','Luxembourger','Macedonian','Malagasy','Malawian','Malaysian','Maldivan','Malian','Maltese','Marshallese','Mauritanian','Mauritian','Mexican','Micronesian','Moldovan','Monacan','Mongolian','Moroccan','Mosotho','Motswana','Mozambican','Namibian','Nauruan','Nepalese','NewZealander','Nicaraguan','Nigerian','Nigerien','NorthKorean','NorthernIrish','Norwegian','Omani','Pakistani','Palauan','Panamanian','PapuaNewGuinean','Paraguayan','Peruvian','Polish','Portuguese','Qatari','Romanian','Russian','Rwandan','SaintLucian','Salvadoran','Samoan','SanMarinese','SaoTomean','Saudi','Scottish','Senegalese','Serbian','Seychellois','SierraLeonean','Singaporean','Slovakian','Slovenian','SolomonIslander','Somali','SouthAfrican','SouthKorean','Spanish','SriLankan','Sudanese','Surinamer','Swazi','Swedish','Swiss','Syrian','Taiwanese','Tajik','Tanzanian','Thai','Togolese','Tongan','Trinidadian/Tobagonian','Tunisian','Turkish','Tuvaluan','Ugandan','Ukrainian','Uruguayan','Uzbekistani','Venezuelan','Vietnamese','Welsh','Yemenite','Zambian','Zimbabwean'];    
        for (var i = 0; i < allNationalities.length; i++) {
            var option=document.createElement("option");
            option.setAttribute("value", allNationalities[i]);
            option.textContent=allNationalities[i];
            document.getElementById("nationality").appendChild(option);
        }
    }());

    document.getElementById("addNewAuthor").addEventListener("click",function () {
        document.getElementById("addAuthor").style.display="block";
        document.getElementById("search").style.display="none";   
        document.getElementById("profilePage").style.display="none";   
        document.getElementById("addBook").style.display="none";  
        document.getElementById("myTableBook").style.display="none";  
        document.getElementById("myTableAuthor").style.display="none";
        document.getElementById("saveChangesA").style.visibility = "hidden";
        
    });

    var Author=function (id, name, lastName, born ,died, nationality) {
        this.name=name;
        this.lastName=lastName;
        this.born=born;
        this.died=died;
        this.nationality=nationality;
    }
    var createAuthor = function () {
        var name = document.getElementById("authorName").value;
        var lastName = document.getElementById("authorLastName").value;
        var born = document.getElementById("born").value;
        var died = document.getElementById("died").value;
        var nationality = document.getElementById("nationality").value;
        var id=name+lastName+born;
        var author = new Author(id, name, lastName, born, died, nationality);
        return author;
    }
    var addAuthorToAllAuthors=function name(id) {
        if(!allAuthors[id] && document.querySelectorAll("require")){
            allAuthors[id] = createAuthor();
            return allAuthors;
        }
        else console.log("this author already exist!"); 
    }      


    var createAuthorsList=function () {
        var arreyId=[];
        for (var key in allAuthors) {
            arreyId.push(key);       
            }
            for (var i = 0; i < arreyId.length; i++) {
                var option=document.createElement("option");                
                option.setAttribute("value",allAuthors[arreyId[i]].name+" "+allAuthors[arreyId[i]].lastName);
                option.textContent=allAuthors[arreyId[i]].name+" "+allAuthors[arreyId[i]].lastName;
                document.getElementById("author").appendChild(option);
            }
        };
        document.getElementById("addNewBook").addEventListener("click",function () {
            document.getElementById("addBook").style.display="block";
            document.getElementById("saveChanges").style.visibility = "hidden"; 
            document.getElementById("tableBookList").style.display="none";
            document.getElementById("tableAuthorList").style.display="none";
            document.getElementById("profilePage").style.display="none";
            document.getElementById("addAuthor").style.display="none";
            document.getElementById("search").style.display="none";
            document.getElementById("author").addEventListener("click",function () {
                createAuthorsList()  
              });  
        });
        document.getElementById("saveNewAuthor").addEventListener("click", function (e) {
            e.preventDefault();
            createAuthor();
            var authorsId=document.getElementById("authorName").value+document.getElementById("authorLastName").value+document.getElementById("born").value;
            addAuthorToAllAuthors(authorsId);
            lStorage.save("allAuthors",allAuthors);
            document.getElementById("addAuthor").reset();
        });
        document.getElementById("author").addEventListener("click",function () {
            createAuthorsList(); 
          });
        var stars=document.querySelectorAll(".star");
        var starNo;
        for(var i=0;i<stars.length;i++){
            stars[i].addEventListener("click", function () {
                starNo=this.className.charAt(5)
                for(var j=0;j<starNo;j++){
                    stars[j].src="pictures/rating/yelowStar.png";            
                }
            });
        }
    
    var Book=function (isbn, name, author, publicationYear, gender, borrowed,whom, read, rate) {
        this.isbn=isbn;
        this.name=name;
        this.author=author;
        this.publicationYear=publicationYear;
        this.gender=gender;
        this.borrowed=borrowed;
        this.whom=whom;
        this.read=read;
        this.rate=rate;
    }

    var createBook = function () {
        var isbn = document.getElementById("bookIsbn").value;
        var name = document.getElementById("bookName").value;
        var author = document.getElementById("author").value;   
        var publicationYear = document.getElementById("year").value;
        var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
        var borrowed = document.getElementById("borrowed").checked;
        var whom = document.getElementById("whom").value;
        var read = document.getElementById("read").checked;
        var rate = starNo;
        var book = new Book(isbn, name, author, publicationYear, gender, borrowed,whom, read, rate);        
        return book;
    }    
    var addBookToAllBooks=function (isbn) {   
        if(!allBooks[isbn] && document.querySelectorAll("require")!=null){
            allBooks[isbn] = createBook();
            return allBooks;
        }
        else console.log("this book already exist!");       
    }

    document.getElementById("addAuthorButton").addEventListener("click", function () {
        document.getElementById("addAuthor").style.display="block"; 
        document.getElementById("saveChangesA").style.display="none";
    });
    document.getElementById("read").addEventListener("click", function () {
       document.getElementById("yesRead").style.display="block";

    });
    document.getElementById("notRead").addEventListener("click", function () {
        document.getElementById("yesRead").style.display="none";
        
    });
    document.getElementById("borrowed").addEventListener("click",function () {
        document.getElementById("whomBorrowed").style.display="block";
    });
    document.getElementById("notBorrowed").addEventListener("click", function () {
        document.getElementById("whomBorrowed").style.display="none";
    });
    document.getElementById("saveBook").addEventListener("click", function (e) { 
        e.preventDefault();
        createBook();
       addBookToAllBooks(document.getElementById("bookIsbn").value);
        lStorage.save("allBooks",allBooks);
        document.getElementById("addBook").reset();
    });
    return {
        createAuthor : createAuthor,
        createBook : createBook,
        addBookToAllBooks :addBookToAllBooks
    }
}());
//booksAndAuthors();
//##########################   Tabela sa knjigama
var bookTable=(function () {
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
        var headRow=document.createElement("tr");
        headRow.setAttribute("id", "bookHeadRow")
        tableHead.appendChild(headRow);
        for (var i = 0; i < numberOfColumn; i++) {
            var column = document.createElement("th");
            headRow.appendChild(column);
        }
        table.appendChild(tbody);
        return table;
    };
    var writeTableHead = function (numberOfColumn,arreyWidthNames) {
        var nameOfColumn = document.getElementById("bookHeadRow").childNodes;
        for(var i=0;i<numberOfColumn;i++){
            nameOfColumn[i].textContent = arreyWidthNames[i];
        }
        nameOfColumn[numberOfColumn-1].colSpan="2";
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
            if(allBooks[bookIsbn].borrowed == true){
                newRow.childNodes[5].textContent ="yes";
                newRow.childNodes[5].setAttribute("title","book is borowed to "+ allBooks[bookIsbn].whom);
            }else{
                newRow.childNodes[5].textContent ="no";
            }
            (allBooks[bookIsbn].read == true)?newRow.childNodes[6].textContent ="yes":newRow.childNodes[6].textContent ="no";       
            (allBooks[bookIsbn].read==true)?newRow.childNodes[7].textContent = allBooks[bookIsbn].rate+"/5":newRow.childNodes[7].textContent = "";
            

            var del=document.createElement("div");
            del.setAttribute("id",bookIsbn+"_del");
            del.textContent="del";
            newRow.childNodes[8].appendChild(del);
            var edit=document.createElement("div");
            edit.setAttribute("id",bookIsbn+"_edit");
            edit.textContent= "edit";  
            newRow.childNodes[9].appendChild(edit);
        }
    }
    document.getElementById("bookList").addEventListener("click",function () {
        document.getElementById("myTableBook").style.display="block"; 
        document.getElementById("tableBookList").style.display="block";
        document.getElementById("myTableAuthor").style.display="none";
        document.getElementById("addBook").style.display="none";
        document.getElementById("addAuthor").style.display="none";
        document.getElementById("search").style.display="none";
        document.getElementById("profilePage").style.display="none";
        
        
    });   
    return{
        createHead : createTableHead,
        writeHead : writeTableHead,
        writeData : writeTableData

    }
}());
// kako bi ovo pozvala da bookTable nije IIFE f-ja???
bookTable.createHead(9,"booksTable", "tableSorter");
bookTable.writeHead(9,["ISBN","Book name","Author","Publication year","Gender","Borrowed","Read","Rateing","EditOrDel"]);
bookTable.writeData();

var authorTable=(function () {
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
        var headRow=document.createElement("tr");
        headRow.setAttribute("id", "authorHeadRow")
        tableHead.appendChild(headRow);
        for (var i = 0; i < numberOfColumn; i++) {
            var column = document.createElement("th");
            headRow.appendChild(column);
        }
        table.appendChild(tbody);
        return table;
    };
    var writeTableHead = function (numberOfColumn,arreyWidthNames) {
        var nameOfColumn = document.getElementById("authorHeadRow").childNodes;
        for(var i=0;i<numberOfColumn;i++){
            nameOfColumn[i].textContent = arreyWidthNames[i];
        }
        nameOfColumn[numberOfColumn-1].colSpan="2";
    };    
    
    var writeTableData = function () {       

        for (var authorsId in allAuthors) {            
            var newRow = document.createElement("tr");            
            document.getElementById("authorsTable").appendChild(newRow); 
                for (var i = 0; i<7; i++) {
                    var newColumn = document.createElement("td");
                    newRow.appendChild(newColumn);                
            }            
            newRow.childNodes[0].textContent = allAuthors[authorsId].name;
            newRow.childNodes[1].textContent = allAuthors[authorsId].lastName;
            newRow.childNodes[2].textContent = allAuthors[authorsId].born;
            newRow.childNodes[3].textContent = allAuthors[authorsId].died;
            newRow.childNodes[4].textContent = allAuthors[authorsId].nationality;
            newRow.childNodes[5].setAttribute = ("id",authorsId+"del");
            var del=document.createElement("div");
            del.setAttribute("id",authorsId+"-del");
            del.textContent="del";
            newRow.childNodes[5].appendChild(del);
            var edit=document.createElement("div");
            edit.setAttribute("id",authorsId+"-edit");
            edit.textContent= "edit";  
            newRow.childNodes[6].appendChild(edit);
        }
    }
    document.getElementById("authorList").addEventListener("click",function () {
        document.getElementById("myTableAuthor").style.display="block";
        document.getElementById("tableAuthorList").style.display="block";
        document.getElementById("myTableBook").style.display="none"; 
        document.getElementById("search").style.display="none";  
        document.getElementById("addBook").style.display="none";  
        document.getElementById("addAuthor").style.display="none";  
        document.getElementById("profilePage").style.display="none";  
        
        
    });
        return{
            createHead : createTableHead,
            writeHead : writeTableHead,
            writeData : writeTableData
    
        }
})();
    authorTable.createHead(6,"authorsTable","tableSorter");
    authorTable.writeHead(6,["Name","Last Name", "Birth year","Died year","Nationality", "EditOrDel"])
    authorTable.writeData();
//########################## sortiranje pomocu Jqueri-ja
 var sortTable=function (id) {
    $(document).ready(function() { 
        $("#"+id).tablesorter(); 
    }); 

    $(document).ready(function() { 
        $("#"+id).tablesorter( {sortList: [[0,0], [1,0]]} ); 
    }); 
};
sortTable("myTableBook");
sortTable("myTableAuthor");
//############################ Profil korisnika

    document.getElementById("profile").addEventListener("click", function () {
        
            var loggedInUser=lStorage.load("loggedInUser");
            document.getElementById("myName").textContent=loggedInUser.name;
            document.getElementById("myLastName").textContent=loggedInUser.lastName;
            document.getElementById("myGender").textContent=loggedInUser.gender;
            document.getElementById("myEmail").textContent=loggedInUser.email;
            document.getElementById("profilePage").style.display="block";  
            document.getElementById("tableBookList").style.display="none";
            document.getElementById("tableAuthorList").style.display="none";
            document.getElementById("search").style.display="none";
            document.getElementById("addBook").style.display="none";
            document.getElementById("addAuthor").style.display="none";
            
            
    });

//############################ edit & del
var editAndDel= function () {
    var allEditB=document.querySelectorAll("[id$='_edit']");
    var saveChanges=document.createElement("button");
    saveChanges.setAttribute("type", "submit")
    saveChanges.setAttribute("id", "saveChanges");
    saveChanges.textContent="Save Changes";
    document.getElementById("buttons").appendChild(saveChanges);
    for(var i=0; i<allEditB.length; i++){ 
        allEditB[i].addEventListener("click", function (e) {
            e.preventDefault();
            var isbn=this.id.substr(0,this.id.length-5);
         document.getElementById("addBook").style.display="block";
         document.getElementById("saveChanges").style.visibility = "visible";            
         console.log(allBooks[isbn]);
         document.getElementById("bookIsbn").value=allBooks[isbn].isbn;
         document.getElementById("bookName").value=allBooks[isbn].name;
         document.getElementById("author").value=allBooks[isbn].author;
         document.getElementById("gender").value=allBooks[isbn].gender;
         document.getElementById("year").value=allBooks[isbn].publicationYear;
         document.getElementById("borrowed").value=allBooks[isbn].borrowed;
         document.getElementById("whom").value=allBooks[isbn].whom;
         document.getElementById("read").value=allBooks[isbn].read;
         document.getElementById("rate").value=allBooks[isbn].rate;
        
            document.getElementById("saveChanges").addEventListener("click", function () {
                if(allBooks[isbn].isbn==document.getElementById("bookIsbn").value && document.querySelectorAll("require")!=null){
                allBooks[isbn] = booksAndAuthors.createBook();
                }          
                else {
                    console.log("you can`t change isbn number of a book and you need to fill all requered filds");
                }
                lStorage.save("allBooks",allBooks);
            });
        });
    }
    var allEditA=document.querySelectorAll("[id$='-edit']");
    var saveChangesA=document.createElement("button");

        saveChangesA.setAttribute("type", "submit")
        saveChangesA.setAttribute("id", "saveChangesA");
        saveChangesA.textContent="Save Changes";
        document.getElementById("buttonsA").appendChild(saveChangesA);

        for(var i=0; i<allEditA.length; i++){ 
            allEditA[i].addEventListener("click", function (e) {
                e.preventDefault();
                var authorsId=this.id.substr(0,this.id.length-5);
    
                document.getElementById("addAuthor").style.display="block";
                document.getElementById("saveChangesA").style.visibility = "visible";            
                document.getElementById("authorName").value=allAuthors[authorsId].name;
                document.getElementById("authorLastName").value=allAuthors[authorsId].lastName;
                document.getElementById("born").value=allAuthors[authorsId].born;
                document.getElementById("died").value=allAuthors[authorsId].died;
                document.getElementById("nationality").value=allAuthors[authorsId].nationality;

                document.getElementById("saveChangesA").addEventListener("click", function () {
                    if( document.querySelectorAll("require")!=null){
                    allAuthors[authorsId] = booksAndAuthors.createAuthor();
                    }       
                    lStorage.save("allAuthors",allAuthors);
                });
            });
        }
    var deleteBooksOrAuthor=function (bookOrAuthor) {
        var allDell;
        if(bookOrAuthor=="book"){
            allDell=document.querySelectorAll("[id$='_del']");
            for(var i=0;i<allDell.length;i++){
                allDell[i].addEventListener("click", function () {
                    var isbn=this.id.substr(0,this.id.length-4);               
                    console.log(allBooks[isbn]);
                    delete allBooks[isbn];
                    lStorage.save("allBooks",allBooks); 
                    location.reload();
                    document.getElementById("myTableBook").style.display="block";// ne rade
                    document.getElementById("tableBookList").style.display="block";
                });
            }
        }else if(bookOrAuthor=="author"){ 
            allDell=document.querySelectorAll("[id$='-del']");
            for(var i=0;i<allDell.length;i++){
                allDell[i].addEventListener("click", function () {
                    var authorsId=this.id.substr(0,this.id.length-4);   
                    //console.log(allAuthors[authorsId]);
                    delete allAuthors[authorsId];
                    lStorage.save("allAuthors",allAuthors);
                    location.reload();  
                    document.getElementById("myTableAuthor").style.display="block";// ne rade
                    document.getElementById("tableAuthorList").style.display="block";
                    
                });       
            }   
        }
    }
    deleteBooksOrAuthor("book");
    deleteBooksOrAuthor("author");
    
};
editAndDel();
//############################# pretraga
var search = function () { 
   var find=false;
   var span=document.createElement("span");
   span.textContent="";
   document.body.appendChild(span);
   document.getElementById("searchButton").addEventListener("click",function () {
        var searchText=document.getElementById("searchName").value;
        for (var isbn in allBooks) {
            var string=allBooks[isbn].name+allBooks[isbn].author;
                if(string.indexOf(searchText)!=-1){
                    span.textContent+=allBooks[isbn].name;
                    console.log("name ",allBooks[isbn].name);  
                    console.log("search text ",searchText);     
                    console.log(string.indexOf(searchText));
                    find=true;
                }
        }
    if(find==false) span.textContent="Nema trazene knjige";
   });
};
search();
document.getElementById("searchMenuButton").addEventListener("click",function () {
    document.getElementById("search").style.display="block";
    document.getElementById("myTableBook").style.display="block";
    document.getElementById("tableBookList").style.display="block";
    document.getElementById("tableAuthorList").style.display="none";
    document.getElementById("addBook").style.display="none";
    document.getElementById("addAuthor").style.display="none";
    document.getElementById("profilePage").style.display="none";
    
});

