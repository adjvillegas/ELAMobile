//DECLARACIÓN DE VARIABLES GLOBALES
  var gv_boton = null; 
  var gv_letra = null;
  var gv_user  = null;
  var gv_pass  = null;

//Documento Jquery que se ejecuta cuando
//toda la página este cargada en el cliente
$(document).ready(function(data){

// Cambiamos el estilo de la letra.   
   $(".Boton_select").toggleClass("h3");

    //Al presionar un boton con el estilo Boton_select
    $(".Boton_select").click(function(){

    // Obtenemos la letra seleccionada.
        procesar_letra($(this));

     });

    //Al presionar el botón voz.
    $("#voz").click(function(){

// Pisamos el valor con vacío.
     //meSpeak.speak("holaaaa!");

     meSpeak.speak($('#mensaje').val());

    });

    //Al presionar el botón borrar.
    $("#borrar").click(function(){

      //Obtenemos texto escrito.
      var texto =  $('#mensaje').val();

      var n = texto.length;
      
      n = n - 1;

      var res = texto.substr(0, n);

      $('#mensaje').val(res);

      // Inicializamos la botonera
      inicializar_botones();      

    });

    //Al presionar el botón borrar todo.
    $("#borrar_todo").click(function(){

// Pisamos el valor con vacío.
      $('#mensaje').val(' ');

      // Inicializamos la botonera
      inicializar_botones();      

    });

    //Al presionar el botón borrar.
    $("#espacio").click(function(){

      //Obtenemos texto escrito.
      var texto =  $('#mensaje').val();


      $('#mensaje').val(texto + ' ');

      // Inicializamos la botonera
      inicializar_botones();      

    });

// Si persionamos el botón Cancelar
   $("#cancelar").click(function(){

       gv_boton = null;

       inicializar_botones(); 

   });


// Si persionamos el botón Cancelar Login
 $("#aceptar_login").click(function(){

      //alert("LLegaaasteee!!");
       
//       gv_pass =  $(objeto).attr("ema");
      //Obtenemos Usuario.
        gv_user =  $('#user').val();
        gv_pass =  $('#pass').val();

      var vPass = document.getElementById("pass");
      //Validar Usuario y Contraseña
        validar_usuario(gv_user,gv_pass);

});


// Si persionamos el botón Cancelar Login
   $("#cancelar_login").click(function(){

       alert("CAaacaa cancelada neneee");
   });


// Armar Botonera
    inicializar_botones();

});


function procesar_letra(objeto){

//Accedemos al atributo 
//del bóton que se presiona
//$(this).attr("nro")
//alert($(this).attr("nro"));

// Si es la primera vez que se presiona
   if (gv_boton == null) {

    //Ocultamos los botones Espacio/Borrar/Borrar Todo
    // y mostramos el boton Cancelar.
    $('#espacio').hide();
    $('#borrar').hide();
    $('#borrar_todo').hide();
    $('#cancelar').show();
            
    gv_boton   = $(objeto).attr("nro");
    gv_tablero = $(objeto).attr("nro_t"); 

// Dibuja las letras del grupo seleccionado
// en cada uno de los circulos.
    distribuir_botones(gv_tablero,gv_boton);

// Cancelar
    cancelar_proceso(gv_boton);    

    return;

   }

// Si es la segunda vez que se presiona
   if (gv_letra == null) {

// Inicializamos la botonera
    inicializar_botones();

    gv_letra =  $(objeto).attr("nro");
    
    //alert("Boton:" + gv_boton + "Letra:" + gv_letra );

    $.ajax({
            url: 'misc/inc_bck_tesis.php',
            type: 'POST',
            async: false,
            data: { idboton  : gv_boton,
                    idletra  : gv_letra,
            },
            success: function(data) {

// Manejo de Errores.
                if (data.resultado == "OK") {
                
                   // alert(data.letra); //Conexión Exitosa

                   var texto =  $('#mensaje').val(); //Trae el valor que ya esta dentro de la caja de texto (GET)

                   //Devolvemos valor en caja de texto.
                   $('#mensaje').val(texto + data.letra);

                } else {
                
                    alert(data.msg); //Error en la conexión
                }

            },
            error:function(){

                alert("Error al intentar obtener datos");
            },

            dataType: 'json'
    });


// Limpiamos las variables para
// la próxima ejecuación.
    gv_letra = null;
    gv_boton = null;

   }    
}

//Función Armar botonera.
function inicializar_botones(){

//Ocultamos el boton cancelar 
    //Ocultamos los botones Espacio/Borrar/Borrar Todo
    // y mostramos el boton Cancelar.
    $('#espacio').show();
    $('#borrar').show();
    $('#borrar_todo').show();
    $('#cancelar').hide();      

//Recorremos todos los elementos Boton_select
$('.Boton_select').each(function(key, values){

//Por ejemplo obtenemos los atributos de cada elemento
//alert($(values).attr('nro'));
    
    $.ajax({
            url: 'misc/inc_bck_botones.php',
            type: 'POST',
            async: false,
            data: {  idtablero : $(values).attr('nro_t'),
                     idboton   : $(values).attr('nro')
            },
            success: function(data) {

// Manejo de Errores.
                if (data.resultado == "OK") {
                
                   var lv_html = "<P>";

                   var lv_cont = 0;

                   $.each(data.letras, function(keyletra, valueletra){

                     lv_cont++;

                     lv_html = lv_html + valueletra.letra + ' ';

                     if (lv_cont == 3) {

                      lv_html = lv_html + '</P> <P>';

                     }   

                   });
                   
                   lv_html = lv_html + '</P>';
                   
                   //Devolvemos los botones.
                   $(values).html(lv_html);

                } else {
                
                    alert(data.msg); //Error en la conexión
                }

            },
            error:function(){

                alert("Error al intentar obtener datos");
            },

            dataType: 'json'
    });


});

}


//Función para distribuir las letras 
//del grupo en cada uno de los circulos
function distribuir_botones(gv_tablero,gv_boton){

    $.ajax({
            url: 'misc/inc_bck_botones.php',
            type: 'POST',
            async: false,
            data: { idtablero : gv_tablero,
                    idboton   : gv_boton,
            },

            success: function(data) {

// Manejo de Errores.
                if (data.resultado == "OK") {
                
                  //var lv_html = "<P>";
                  var cont = 0;
                   $.each(data.letras, function(keyletra, valueletra){
                     cont++;
                     lv_html = '<P>' + valueletra.letra + '  </P>';

                     //Armar selector en forma dinamica
                     $(".Boton_select[nro='" +  cont + "']").html(lv_html);

                   });
                   

                } else {
                
                    alert(data.msg); //Error en la conexión
                }

            },
            error:function(){

                alert("Error al intentar obtener datos");
            },

            dataType: 'json'
    });

}

//Función Validar Usuario y Contraseña.
function validar_usuario(gv_user,gv_pass){
 

//alert("LLegaaasteee!!"); 
//location.href = "admin.html";   

  gv_user = "'"+gv_user+"'";
  gv_pass = "'"+gv_pass+"'";
  
  $.ajax({
            url: 'misc/inc_bck_usuarios.php',
            type: 'POST',
            async: false,
            data: { iduser : gv_user,
                    idpass : gv_pass,
            },

            success: function(data) {

// Manejo de Errores.
                if (data.resultado == "OK") {
                   

                   location.href = "admin.html";  

                } else
                {

                     alert(data.msg); 
                }

            },
            error:function(){

                alert("Error al intentar obtener datos");
            },

            dataType: 'json'
    });

};