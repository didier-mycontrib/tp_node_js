       
var contact = { nom : "" , prenom : "" , adresse : null , telephone : null,   email : "" , objet : "" , message : "" , date : "2018-01-04", statut : "nouveau"};
	  
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
	  
$(function() { 

      // "http://localhost:8282/flow-des-mots/contact" , "http://le-flow-des-mots.fr/flow-des-mots/contact"
	   
	  $('#btn_envoyer').on('click',function(){
		 local_update_contact();
		 
		console.log( "contact/message in the bottle" + JSON.stringify(contact) ) ;
		 $.ajax({
           type: "POST",
		   contentType: "application/json",
           url: "./flow-des-mots/contact",
           dataType: "json",
		   data: JSON.stringify(contact),
           success: function (sentContact) {
               if (sentContact) {
                  $("#span_msg").html("<b>prise de contact bien enregistrée .</b>" );
				  console.log("prise de contact bien enregistrée:" + JSON.stringify(sentContact));
               } else {
                   $("#span_msg").html("une erreur technique a eu lieu dans la prise de contact");
               }
           },
           error: function(xhr, status, error){
        	   $("#span_msg").html( "status:" + status + " error : " + error ) ;
           }
		   });
		});
		  
 });