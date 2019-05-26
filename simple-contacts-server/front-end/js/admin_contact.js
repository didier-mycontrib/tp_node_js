       
//var contact = { _id: null , nom : "" , prenom : "" , adresse : null , telephone : null,   email : "" , objet : "" , message : "" , date : "2018-01-04", statut : "nouveau"};
	  
function convertDate(d) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  return [d.getFullYear(), pad(d.getMonth()+1) ,pad(d.getDate()) ].join('-');
}	  
	  
function local_update_contact(){	             
				contact.nom = $('#f_nom').val();
				contact.prenom = $('#f_prenom').val();
				contact.email = $('#f_email').val();
				contact.objet = $('#f_objet').val();
				contact.message = $('#f_message').val();
				contact.date = convertDate(new Date());
	  }
	  
var tabContacts;

function ajouterLigneDansTableau(contact){

var newTr = tabContacts.getElementsByTagName('tbody')[0].insertRow(-1);

var newTd0 = newTr.insertCell(0);
newTd0.innerHTML='<input type="checkbox" id="'+contact._id+'"/>'+contact._id;
var newTd1 = newTr.insertCell(1); newTd1.innerHTML=contact.date;
var newTd2 = newTr.insertCell(2); newTd2.innerHTML=contact.nom;
var newTd3 = newTr.insertCell(3); newTd3.innerHTML=contact.prenom;
var newTd4 = newTr.insertCell(4); newTd4.innerHTML=contact.email;
var newTd5 = newTr.insertCell(5); newTd5.innerHTML=contact.objet;
var newTd6 = newTr.insertCell(6); newTd6.innerHTML=contact.message;

}	  

function deleteContactServerSide(contactId){
	     console.log("deleting contact of _id = " + contactId );
		 $.ajax({
           type: "DELETE",
           url: "./flow-des-mots/contact/" + contactId,
           success: function (data, textStatus, jqXHR ) {
				  console.log(textStatus);
           },
           error: function(xhr, status, error){
        	   $("#span_msg").html( "status:" + status + " error : " + error ) ;
           }
		   });
}

// "http://localhost:8282/flow-des-mots/contact" , "http://le-flow-des-mots.fr/flow-des-mots/contact"
	  
$(function() { 

	tabContacts =  document.getElementById("tabContacts");

      $('#btn_rechercher').on('click',function(){
		  console.log( "actualisation/recherche de la liste des contacts" ) ;
		  $.ajax({
           type: "GET",
		   contentType: "application/json",
           url: "./flow-des-mots/contact",
           success: function (listeContact) {
               if (listeContact) {
				 // console.log("listeContact:" + JSON.stringify(listeContact));
				  $('#tabContacts tbody > tr').remove(); //supprimer anciennes lignes
				  for(i in listeContact){
					  ajouterLigneDansTableau(listeContact[i]);
				  }
               } else {
                   $("#span_msg").html("une erreur technique a eu lieu");
               }
           },
           error: function(xhr, status, error){
        	   $("#span_msg").html( "status:" + status + " error : " + error ) ;
           }
		   });
	   });
	   
	  $('#btn_supprimer').on('click',function(){
		// local_update_contact();
		console.log( "suppression des contacts selectionnés" ) ;
		var nbRows = tabContacts.rows.length;
		for(i=nbRows-1;i>0;i--){
			var selCheckbox = tabContacts.rows[i].cells[0].firstChild;
			//console.log("selCheckbox of id = " + selCheckbox.id + " with  checked=" + selCheckbox.checked);
			if(selCheckbox.checked) {
				var contactId= selCheckbox.id;
				deleteContactServerSide(contactId);
				tabContacts.deleteRow(i);
			} 
		}
		});
		  
 });