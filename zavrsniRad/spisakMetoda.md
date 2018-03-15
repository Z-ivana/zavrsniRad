
metodi vezani za localStorage:
	loadFromLocalStorage();
	saveToLocalStorage();

metodi vezani za cooki:
	saveToCookiesStorage();
	delFromCookiesStorages();

metodi vezani za log in i registraciju
	let log = true || false 
	isLogedIn();
		log==true
			logOut disolay:block;
			logIn display:none;
		log==false
			logOut disolay:none;
			logIn display:block;
			
	allUsers=loadFromLocalStorage("allUsers")|| allUsers={};
	createUser();
	addUserToAllUsers();
	validateUser();
	
	registerButton
		register disolay:block;
	
	logInButton
		whoIsLoged
		ulogovanKorisnik=lStorage.save("ulogovanKorisnik", allUsers[email]);
		logOut disolay:block;
		logIn display:none;
	
	logOutButton
		localStorage.removeItem("ulogovanKorisnik");
		logOut disolay:none;
		logIn display:block;
	
	forgetPassButton
		forgetPass disolay: block;
	
	sendEmail (ispisuje u consol.log-u);

kreiranje novih knjiga i autora:
		*koristi istu logiku kao createUser();*
	 createAutor()
	 createBook()

sort:
	sortByName;
	sortByRateing;
 
search:
	simpleSearch()
		*pretraga po unetom textu*
	advansedSearch()
		*selektuje vise parametara*
			byGender
			byName
			byAuthor


