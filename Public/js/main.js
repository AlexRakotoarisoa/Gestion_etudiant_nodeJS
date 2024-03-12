let list = document.querySelectorAll(".navigation li");

function activeLink(){
    list.forEach(item => item.classList.remove("hovered"));
    this.classList.add("hovered")
}

list.forEach(item => item.addEventListener("mouseover", activeLink));


/*************************************** N A V I G A T I O N ***********************************/
var acceuil = document.querySelector('#acc');
var histo = document.querySelector('#histogramme');
let toogle = document.querySelector('.toogle');
let navigation = document.querySelector('.navigation');
let topbar = document.querySelector('.topbar');
let main = document.querySelector('.main');
let main1 = document.querySelector('.main1');
var legende = document.querySelector('.con');
let search = document.querySelector('#search');
let ico = document.querySelector('.ico');

ico.addEventListener('click', () => {
  main.style.display = 'block';
  main1.style.display = 'none';
  navigation.classList.toggle("active");
  main.classList.toggle("active");
  topbar.classList.toggle("active");
  main1.classList.toggle("active1");
  search.classList.toggle("active");
  ico.classList.toggle("active");

});
toogle.addEventListener('click', () => {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
    topbar.classList.toggle("active");
    main1.classList.toggle("active1");
    search.classList.toggle("active");
    ico.classList.toggle("active");
  });


acceuil.addEventListener('click', () => {
  main.style.display = 'block';
  main1.style.display = 'none';
  legende.classList.remove('load');
});

histo.addEventListener('click', () => {
  main.style.display = 'none';
  main1.style.display = 'block';
  setTimeout(() => {
    legende.classList.add('load');
  },500);

});

/********************* F O N C T I O N    P O U R   L A    R E C H E R C H E *************************/

function searchTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.querySelector("#tb1");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) { // Modifier l'index si vous souhaitez rechercher dans d'autres colonnes
      td = tr[i].getElementsByTagName("td")[0];
      td1 = tr[i].getElementsByTagName("td")[1];
      if (td || td1) {
          txtValue = td.textContent || td.innerText;
          txtValue1 = td1.textContent || td1.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1 || txtValue1.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
}
    
document.querySelector("#search").addEventListener("input", searchTable);

  /*****************BODY LOAD***************** */

  window.addEventListener('load', function(){
    document.body.classList.add('loaded');
  })




  /*****************  AJOUT ET MODIFICATION **************************** */
  
  var openModalBtn = document.querySelector('#man');
  var editBtn = document.querySelector('#act2');
  var cont = document.querySelector('.contenu');
  var inputs = document.querySelectorAll('.color_b');
  var closeModalBtn = document.querySelector('#close_btn');
  var container = document.querySelector('.container');


  $('#man').on('click', () => {
    $('.contenu').fadeIn(200);
    inputs.forEach(function(content){// ici on a utilisé une fonction anonyme
      content.value = "";
    })
  });


  closeModalBtn.addEventListener('click',resetImage);


  function remplir(id,matr,nom,noteMath,notePhys,image){
    $('.contenu').fadeIn(200);
    document.getElementById('id').value = id;
    document.getElementById('matr').value = matr;
    document.getElementById('nom').value = nom;
    document.getElementById('math').value = parseInt(noteMath);
    document.getElementById('phys').value = parseInt(notePhys);
    document.getElementById('defaultImg').src = image;
    
  }


  
  /************** SUPRESSION ***********/
    const confirmDelete = document.querySelector('#confirmDelete');
    const cancelDelete = document.querySelector('#cancelDelete');
    const idDel = document.querySelector('#id1');
    const boite = document.querySelector('.boite');


    function Del(id) {
      $('.boite').fadeIn(200);
      $('#id1').val(id);
    }


    $('#cancelDelete').on('click',() => {
      $('.boite').fadeOut(200);
    })
  

    confirmDelete.addEventListener('click',() => {
      let pointFinal = "notes/"+idDel.value       // url de la ressource a supprimer
      fetch(                                     // c'est un API javaScript moderne qui permet de realiser des requetes HTTP
          pointFinal, {method : "DELETE"}        //Envoie d'une requete HTTP de type DELETE 
      ).then(
          (reponse)=> reponse.json()             // cette méthode then est appelle lorsque la promesse retourné par fetch est résolue
      ).then(
          (donnee) => window.location.href = donnee.routeRacine //si le fichier a été recu
      ).catch(
          (Erreur) => console.log(Erreur))
      });


/****************** MIN ET MAX DANS LE TABLEAU ****************/
  var maxValue = document.querySelector('#maxValue');
  var minValue = document.querySelector('#minValue');
  var noteGen = document.querySelector('#noteGen');
  var eleveAdmis = document.querySelector('#eleveAdmis');
  var eleveRed = document.querySelector('#eleveRed');
  var col = 4;
  var rows = document.querySelectorAll('#tableNote tr');
  var nombreEtudiant = rows.length - 1;
  var values = [];
  var admis = [];
  var conteurAdmis =0;
  var conteurRed = 0;
  var somme = 0;


  for(var i = 1;i<rows.length;i++){
    var cell= rows[i].getElementsByTagName("td")[col];
    var contenuCell = parseFloat(cell.textContent);
    values.push(contenuCell);
    somme += contenuCell;
    if(contenuCell >= 10){
      conteurAdmis++;
    }else{
      conteurRed++
    }
  }
  var noteMax = Math.max(...values);
  var noteMin = Math.min(...values);
  var moyGen = somme / nombreEtudiant;
  var Moy = moyGen.toFixed(2);

  console.log(noteMax);
  maxValue.textContent = noteMax;
  minValue.textContent = noteMin;
  noteGen.textContent = Moy;
  eleveAdmis.textContent = conteurAdmis;
  eleveRed.textContent = conteurRed;


  /*********************** HISTOGRAMME *******************/
  var barCanvas = document.querySelector("#barCanvas");


var barChart = new Chart (barCanvas,{
	type : "bar",
	data : {
		labels : ["Elève admis","Elève non admis"],
		datasets:[{
			data :[conteurAdmis,conteurRed],
			backgroundColor : [
				"lightgreen",
				"crimson",				
			]
		}]
	},
	options: {
		scales: {
			y:{
				suggestedMax:20,
				ticks: {
					font:{
						size : 18
					}
				}
				
			}
		}
	}
	
	
	
	
})

/*******************    CHANGEMENT DE PROFIL ********************/

function imageChange(event){
  const entre = event.target;
  if(entre.files && entre.files[0]){
    const reader = new FileReader();

    reader.onload = function(e){
      const profileImage = document.querySelector('#defaultImg');
      profileImage.src = e.target.result;
    }
    reader.readAsDataURL(entre.files[0]);
  }
}

function resetImage(){
  $('.contenu').fadeOut(500);
  setTimeout(() => {
    const profileImage = document.querySelector('#defaultImg');
    profileImage.src = "/img/profil.png";
    document.querySelector('#imageUpload').value = '';
  },600);
}

/************affiche min max */

var affiche = document.querySelector('.affiche');
var cardPrincipale = document.querySelector('.cardPrincipale');
var affiche2 = document.querySelector('#affiche2');

affiche.addEventListener('click', () => {
  cardPrincipale.classList.toggle("active");
  $('.affiche').fadeOut(20);
  $('#affiche2').fadeIn(600);

});
affiche2.addEventListener('click', () => {
  cardPrincipale.classList.toggle("active");

  $('.affiche').fadeIn(600);
  $('#affiche2').fadeOut(20);


});

